import { NextRequest, NextResponse } from "next/server"
import { QueryResult } from "couchbase"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/v1/airport/direct-connections:
 *   get:
 *     summary: Get all direct connections from a target airport
 *     description: |
 *       Returns a list of airports with direct connections from the target airport.
 *
 *       This provides an example of using SQL++ query in Couchbase to fetch a list of documents matching the specified criteria.
 *
 *       Code: [`app/api/v1/airport/direct-connections/route.ts`]
 *
 *       Method: `GET`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: destinationAirportCode
 *         in: query
 *         description: FAA code of the target airport
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
 *         description: A list of airports with direct connections from the target airport
 *       500:
 *         description: An error occurred while fetching airports
 */
export async function GET(req: NextRequest) {
  try {
    const { scope } = await getDatabase()
    const destinationAirportCode = req.nextUrl.searchParams.get(
      "destinationAirportCode"
    )
    const limit = req.nextUrl.searchParams.get("limit") ?? 10
    const offset = req.nextUrl.searchParams.get("offset") ?? 0

    if (!destinationAirportCode) {
      return NextResponse.json(
        {
          message: "Destination airport code is required",
        },
        { status: 400 }
      )
    }

    const query = `
      SELECT DISTINCT route.destinationairport
      FROM airport AS airport
      JOIN route AS route ON route.sourceairport = airport.faa
      WHERE airport.faa = $destinationAirportCode AND route.stops = 0
      LIMIT $LIMIT OFFSET $OFFSET
    `

    const options = {
      parameters: {
        destinationAirportCode,
        LIMIT: Number(limit),
        OFFSET: Number(offset),
      },
    }

    const result: QueryResult = await scope.query(query, options)
    const connections: string[] = result.rows.map(
      (row) => row.destinationairport
    )

    return NextResponse.json(connections, { status: 200 })
  } catch (error) {
    
    return NextResponse.json(
      {
        message: "An error occurred while fetching connections",
      },
      { status: 500 }
    )
  }
}
