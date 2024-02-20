import { NextRequest, NextResponse } from "next/server"
import { QueryResult } from "couchbase"

import { getDatabase } from "@/lib/couchbase-connection"
import { Airline } from "@/app/models/AirlineModel"

/**
 * @swagger
 * /api/airline/destination/{destinationAirportCode}:
 *   get:
 *     description: Get all airlines by destination airport
 *     parameters:
 *       - name: airport
 *         in: query
 *         description: Destination airport code
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of results to return
 *         required: false
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: Number of results to skip
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Failed to fetch airlines
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { destinationAirportCode: string } }
) {
  try {
    const { scope } = await getDatabase()
    // Fetching parameters
    const { destinationAirportCode } = params
    const { limit, offset } = await req.json()

    let query: string
    type QueryOptions = {
      parameters: {
        AIRPORT?: string
        LIMIT: number
        OFFSET: number
      }
    }

    let options: QueryOptions

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
        LIMIT: limit,
        OFFSET: offset,
      },
    }

    const result: QueryResult = await scope.query(query, options)
    const airlines: Airline[] = result.rows.map((row) => row.airline)

    return NextResponse.json(airlines, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch airlines" },
      { status: 500 }
    )
  }
}
