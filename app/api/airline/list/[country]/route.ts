import { NextRequest, NextResponse } from "next/server"
import { QueryResult } from "couchbase"

import { getDatabase } from "@/lib/couchbase-connection"
import { Airline } from "@/app/models/AirlineModel"

/**
 * @swagger
 * /api/airline/list/{country}:
 *   get:
 *     description: Get all airlines by country
 *     parameters:
 *       - name: country
 *         in: query
 *         description: Country of the airline
 *         required: false
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
  { params }: { params: { country: string } }
) {
  try {
    const { scope } = await getDatabase()
    // Fetching parameters
    const { country }: Partial<Airline> = params
    const { limit, offset } = await req.json()

    let query: string
    type QueryOptions = {
      parameters: {
        COUNTRY?: string
        LIMIT: number
        OFFSET: number
      }
    }
    let options: QueryOptions
    if (country !== "") {
      query = `
          SELECT airline.callsign,
                 airline.country,
                 airline.iata,
                 airline.icao,
                 airline.name
          FROM airline AS airline
          WHERE airline.country = $COUNTRY
          ORDER BY airline.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `
      options = {
        parameters: { COUNTRY: country, LIMIT: limit, OFFSET: offset },
      }
    } else {
      query = `
          SELECT airline.callsign,
                 airline.country,
                 airline.iata,
                 airline.icao,
                 airline.name
          FROM airline AS airline
          ORDER BY airline.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `

      options = { parameters: { LIMIT: limit, OFFSET: offset } }
    }

    const result: QueryResult = await scope.query(query, options)
    const airlines: Airline[] = result.rows.map((row) => row.airline)
    return NextResponse.json({ airlines }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch airlines" },
      { status: 500 }
    )
  }
}