import { getDatabase } from '@/lib/couchbase-connection';
import { SearchQuery, SearchResult } from 'couchbase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/hotel/search:
 *   get:
 *     summary: Search hotels by name
 *     description: |
 *       Search hotels by name using Full Text Search.
 *
 *       This provides an example of using Full Text Search in Couchbase to fetch a list of documents matching the specified criteria.
 *
 *       Code: [`api/v1/hotel/search/route.ts`]
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
 *         description: A list of hotels matching the name
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: An error occurred while fetching hotels
 */
export async function GET(req: NextRequest) {
  try {
    const { cluster } = await getDatabase();

    const name = req.nextUrl.searchParams.get('name') ?? '';
    const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '10');

    if (!name) {
      return NextResponse.json({ error: 'name query parameter is required' }, { status: 400 });
    }

    const result: SearchResult = await cluster.searchQuery('hotel_search', SearchQuery.prefix(name.toLowerCase()).field('name'), {
      limit: limit,
      skip: offset,
      fields: ['*']
    });

    const hotels = result.rows.map((row) => row.fields);

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = new URLSearchParams(req.nextUrl.search);
//     const name = searchParams.get('name');
//     const offset = searchParams.get('offset') ?? 0;
//     const limit = searchParams.get('limit') ?? 10;

//     if (!name) {
//       return NextResponse.json({ error: "name query parameter is required" }, { status: 400 });
//     }

//     const query = `
//       SELECT * FROM hotel WHERE name LIKE $NAME limit $LIMIT offset $OFFSET
//     `;

//     const { scope } = await getDatabase();
//     const options = {
//       parameters: {
//         NAME: `%${name}%`,
//         LIMIT: Number(limit),
//         OFFSET: Number(offset),
//       },
//     };
//     const result: QueryResult = await scope.query(query, options);
//     const hotels: THotel[] = result.rows.map((row) => row.hotel);

//     return NextResponse.json(hotels, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error', message: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
