import { NextRequest, NextResponse } from "next/server"
import { QueryResult } from "couchbase"

import { getDatabase } from "../../../../../lib/couchbase-connection"
import { Airline } from "../../../../models/AirlineModel"

/**
 * @swagger
 * /api/airline/destination/{destinationAirportCode}:
 *   get:
 *     description: Get all airlines flying to a specific destination airport
 *     parameters:
 *       - name: destinationAirportCode
 *         in: path
 *         description: The ICAO or IATA code of the destination airport
 *         required: true
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Airline'
 *       500:
 *         description: An error occurred while fetching airlines
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { destinationAirportCode: string } }
) {
  try {
    
    const { scope } = await getDatabase()
    
    const { destinationAirportCode } = params
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

    const result: QueryResult = await scope.query(query, options)
    const airlines: Airline[] = result.rows
    return NextResponse.json(airlines, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch airlines" },
      { status: 500 }
    )
  }
}
