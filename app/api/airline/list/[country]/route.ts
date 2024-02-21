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
 *         description: A list of airlines from the specified country
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
  { params }: { params: { country: string } }
) {
  try {
    const { scope } = await getDatabase()
    const country = params.country
    const limit = req.nextUrl.searchParams.get("limit") ?? 10
    const offset = req.nextUrl.searchParams.get("offset") ?? 0

    console.log("country", country, "limit", limit, "offset", offset)

    let query: string
    type QueryOptions = {
      parameters: {
        COUNTRY?: string
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
        FROM airline AS air
        WHERE air.country = $COUNTRY
        LIMIT $LIMIT OFFSET $OFFSET
      `

    options = {
      parameters: {
        COUNTRY: country,
        LIMIT: Number(limit),
        OFFSET: Number(offset),
      },
    }

    const result: QueryResult = await scope.query(query, options)
    const airlines: Airline[] = result.rows

    return NextResponse.json(airlines, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching airlines",
      },
      { status: 500 }
    )
  }
}
