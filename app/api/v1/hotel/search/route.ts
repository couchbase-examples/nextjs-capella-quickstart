// app/api/v1/hotel/route.ts
import { THotel } from '@/app/models/Hotel';
import { getDatabase } from '@/lib/couchbase-connection';
import { QueryResult } from 'couchbase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/hotel/search:
 *   get:
 *     summary: Search hotels by name
 *     description: |
 *       Search hotels by name.
 *
 *       This provides an example of using SQL++ query in Couchbase to fetch a list of documents matching the specified criteria.
 *
 *       Code: [`app/api/v1/hotel/route.ts`]
 *
 *       Method: `GET`
 *     tags:
 *       - Hotel
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the hotel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of hotels matching the name
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: An error occurred while fetching hotels
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = new URLSearchParams(req.nextUrl.search);
    const name = searchParams.get('name');
    const offset = searchParams.get('offset') ?? 0;
    const limit = searchParams.get('limit') ?? 10;

    if (!name) {
      return NextResponse.json({ error: "name query parameter is required" }, { status: 400 });
    }

    const query = `
      SELECT * FROM hotel WHERE name LIKE $NAME limit $LIMIT offset $OFFSET
    `;

    const { scope } = await getDatabase();
    const options = {
      parameters: {
        NAME: `%${name}%`,
        LIMIT: Number(limit),
        OFFSET: Number(offset),
      },
    };
    const result: QueryResult = await scope.query(query, options);
    const hotels: THotel[] = result.rows.map((row) => row.hotel);

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}
