// app/api/v1/hotel/route.ts
import { THotel } from '@/app/models/Hotel';
import { getDatabase } from '@/lib/couchbase-connection';
import { SearchQuery, SearchResult } from 'couchbase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/hotel/filter:
 *   get:
 *     summary: Filter hotels by various criteria
 *     description: |
 *       Filter hotels by various criteria such as country, city, etc. using Full Text Search.
 *
 *       This provides an example of using Full Text Search in Couchbase to fetch a list of documents matching the specified criteria.
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
 *         required: false
 *         schema:
 *           type: string
 *       - name: title
 *         in: query
 *         description: Title of the hotel
 *         required: false
 *         schema:
 *           type: string
 *       - name: description
 *         in: query
 *         description: Description of the hotel
 *         required: false
 *         schema:
 *           type: string
 *       - name: country
 *         in: query
 *         description: Country of the hotel
 *         required: false
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: City of the hotel
 *         required: false
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         description: State of the hotel
 *         required: false
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
 *         description: A list of hotels matching the criteria
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: An error occurred while fetching hotels
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

        const queries = [];

        if (searchParams.name) {
            queries.push(SearchQuery.match(searchParams.name).field('name'));
        }
        if (searchParams.title) {
            queries.push(SearchQuery.match(searchParams.title).field('title'));
        }
        if (searchParams.description) {
            queries.push(SearchQuery.match(searchParams.description).field('description'));
        }
        if (searchParams.country) {
            queries.push(SearchQuery.match(searchParams.country).field('country'));
        }
        if (searchParams.city) {
            queries.push(SearchQuery.match(searchParams.city).field('city'));
        }
        if (searchParams.state) {
            queries.push(SearchQuery.match(searchParams.state).field('state'));
        }

        const conjunctsQuery = SearchQuery.conjuncts(...queries);
        const offset = parseInt(searchParams.offset ?? '0');
        const limit = parseInt(searchParams.limit ?? '10');
        const options = {
            limit,
            skip: offset,
            fields: ['*'],
        };

        const { cluster } = await getDatabase();
        const result: SearchResult = await cluster.searchQuery('hotel_search', conjunctsQuery, options);

        const hotels: THotel[] = result.rows.map((row) => {
            return {
                id: row.id,
                name: row.fields?.name,
                title: row.fields?.title,
                description: row.fields?.description,
                country: row.fields?.country,
                city: row.fields?.city,
                state: row.fields?.state,
            };
        });

        return NextResponse.json(hotels, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', message: (error as Error).message },
            { status: 500 }
        );
    }
}
// export async function GET(req: NextRequest) {
//     try {
//         const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
//         const parsedParams = HotelSchema.parse(searchParams);

//         let query = `SELECT * FROM hotel WHERE 1=1`;
//         const options: { parameters: { [key: string]: string | number } } = {
//             parameters: {},
//         };

//         if (parsedParams.name) {
//             query += ` AND name = $NAME`;
//             options.parameters['NAME'] = `${parsedParams.name}`;
//         }
//         if (parsedParams.title) {
//             query += ` AND title = $TITLE`;
//             options.parameters['TITLE'] = `${parsedParams.title}`;
//         }
//         if (parsedParams.description) {
//             query += ` AND description = $DESCRIPTION`;
//             options.parameters['DESCRIPTION'] = `${parsedParams.description}`;
//         }
//         if (parsedParams.country) {
//             query += ` AND country = $COUNTRY`;
//             options.parameters['COUNTRY'] = `${parsedParams.country}`;
//         }
//         if (parsedParams.city) {
//             query += ` AND city = $CITY`;
//             options.parameters['CITY'] = `${parsedParams.city}`;
//         }
//         if (parsedParams.state) {
//             query += ` AND state = $STATE`;
//             options.parameters['STATE'] = `${parsedParams.state}`;
//         }

//         const offset = searchParams.offset ?? 0;
//         const limit = searchParams.limit ?? 10;
//         query += ` limit $LIMIT offset $OFFSET`;
//         options.parameters['LIMIT'] = Number(limit);
//         options.parameters['OFFSET'] = Number(offset);

//         const { scope } = await getDatabase();

//         const result: QueryResult = await scope.query(query, options);
//         const hotels: THotel[] = result.rows.map((row) => row.hotel);

//         return NextResponse.json(hotels, { status: 200 });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return NextResponse.json(
//                 { error: 'Invalid request parameters', message: error.issues },
//                 { status: 400 }
//             );
//         }
//         return NextResponse.json(
//             { error: 'Internal server error', message: (error as Error).message },
//             { status: 500 }
//         );
//     }
// }
