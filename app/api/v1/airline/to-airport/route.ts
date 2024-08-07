import { NextRequest, NextResponse } from "next/server"
import { QueryResult } from "couchbase"

import { getDatabase } from "@/lib/couchbase-connection"
import { TAirline } from "@/app/models/Airline"

/**
 * @swagger
 * /api/v1/airline/to-airport:
 *   get:
 *     summary: Get airlines flying to a destination airport
 *     description: |
 *       Get list of Airlines flying to a destination airport.
 *
 *       This provides an example of using SQL++ query in Couchbase to fetch a list of documents matching the specified criteria.
 *
 *       Code: [`app/api/v1/airline/to-airport/route.ts`]
 *
 *       Method: `GET`
 *     tags:
 *        - Airline
 *     parameters:
 *       - name: destinationAirportCode
 *         in: query
 *         description: The ICAO or IATA code of the destination airport
 *         required: true
 *         example: 'LAX'
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of results to return
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: offset
 *         in: query
 *         description: Number of results to skip for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: A list of airlines flying to the specified destination airport
 *       500:
 *         description: An error occurred while fetching airlines
 */
export async function GET(req: NextRequest) {
  try {
    const { scope } = await getDatabase()

    const destinationAirportCode =
      req.nextUrl.searchParams.get("destinationAirportCode") ?? ""
    const limit = req.nextUrl.searchParams.get("limit") ?? 10
    const offset = req.nextUrl.searchParams.get("offset") ?? 0

    let query: string
    type QueryOptions = {
      parameters: {
        AIRPORT?: string
        LIMIT: number
        OFFSET: number
      }
    }

    let options: QueryOptions

    if (destinationAirportCode === "") {
      return NextResponse.json(
        { message: "Destination airport code is required" },
        { status: 400 }
      )
    } else {
      query = `
        SELECT air.callsign,
               air.country,
               air.iata,
               air.icao,
               air.id,
               air.name,
               air.type
        FROM (SELECT DISTINCT META(airline).id AS airlineId
              FROM route
              JOIN airline
              ON route.airlineid = META(airline).id
              WHERE route.destinationairport = $AIRPORT) AS subquery
        JOIN airline AS air
        ON META(air).id = subquery.airlineId
        LIMIT $LIMIT OFFSET $OFFSET
      `
      options = {
        parameters: {
          AIRPORT: destinationAirportCode,
          LIMIT: Number(limit),
          OFFSET: Number(offset),
        },
      }
    }

    const result: QueryResult = await scope.query(query, options)
    const airlines: TAirline[] = result.rows
    return NextResponse.json(airlines, { status: 200 })
  } catch (error) {
    
    return NextResponse.json(
      { message: "Failed to fetch airlines" },
      { status: 500 }
    )
  }
}
