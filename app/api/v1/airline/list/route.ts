import { NextRequest, NextResponse } from "next/server"
import { QueryResult } from "couchbase"

import { getDatabase } from "@/lib/couchbase-connection"
import { TAirline } from "@/app/models/Airline"

/**
 * @swagger
 * /api/v1/airline/list:
 *   get:
 *     summary: Get all airlines by country
 *     description: |
 *       Get list of Airlines. Optionally, you can filter the list by Country.
 *       
 *       This provides an example of using SQL++ query in Couchbase to fetch a list of documents matching the specified criteria.
 *       
 *       Code: [`app/api/v1/airline/list/route.ts`]  
 * 
 *       Method: `GET`
 *     tags:
 *       - Airline
 *     parameters:
 *       - name: country
 *         in: query
 *         description: Country of the airline
 *         required: false
 *         example: 'United States'
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
 *       500:
 *         description: An error occurred while fetching airlines
 */
export async function GET(
  req: NextRequest,
) {
  try {
    const { scope } = await getDatabase()
    const country = req.nextUrl.searchParams.get("country") ?? ""
    const limit = req.nextUrl.searchParams.get("limit") ?? 10
    const offset = req.nextUrl.searchParams.get("offset") ?? 0

    let query: string
    type QueryOptions = {
      parameters: {
        COUNTRY?: string
        LIMIT: number
        OFFSET: number
      }
    }

    let options: QueryOptions

    if (country === "") {
      query = `
        SELECT air.callsign,
               air.country,
               air.iata,
               air.icao,
               air.id,
               air.name,
               air.type
        FROM airline AS air
        LIMIT $LIMIT OFFSET $OFFSET
      `
      options = {
        parameters: {
          LIMIT: Number(limit),
          OFFSET: Number(offset),
        },
      }
    } else {
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
    }

    const result: QueryResult = await scope.query(query, options)
    const airlines: TAirline[] = result.rows

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
