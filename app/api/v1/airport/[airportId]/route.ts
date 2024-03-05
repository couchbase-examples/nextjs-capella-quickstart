import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"
import { Airport } from "@/app/models/Airport"

/**
 * @swagger
 * /api/airport/{airportId}:
 *   get:
 *     summary: Get an airport by ID
 *     description: |
 *       Get airport with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to get a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airport/[airportId]/route.ts` Method: `GET`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the airport
 *       404:
 *         description: Airport not found
 *       500:
 *         description: An error occurred while fetching airport
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const { airportCollection } = await getDatabase()

    const airport = await airportCollection.get(airportId)
    if (airport) {
      return NextResponse.json(airport.content as Airport, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Airport not found", error: "Airport not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching airport",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/airport/{airportId}:
 *   post:
 *     summary: Create an airport
 *     description: |
 *       Create an airport with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to create a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airport/[airportId]/route.ts` Method: `POST`
 *     tags:
 *       - Airport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airport'
 *     responses:
 *       201:
 *         description: Returns the created airport
 *       409:
 *         description: Airport already exists
 *       500:
 *         description: An error occurred while creating airport
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const airportData: Airport = await req.json()
    const { airportCollection } = await getDatabase()

    const createdAirport = await airportCollection.insert(
      airportId,
      airportData
    )
    if (createdAirport) {
      return NextResponse.json(
        {
          airportId: airportId,
          airportData: airportData,
          createdAirport: createdAirport,
        },
        {
          status: 201,
        }
      )
    } else {
      return NextResponse.json(
        {
          message: "Airport already exists",
          error: "Airport already exists",
        },
        { status: 409 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while creating airport",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/airport/{airportId}:
 *   put:
 *     summary: Update an airport
 *     description: |
 *       Update an airport with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to update a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airport/[airportId]/route.ts` Method: `PUT`
 *     tags:
 *       - Airport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airport'
 *     responses:
 *       200:
 *         description: Returns the updated airport
 *       404:
 *         description: Airport not found
 *       500:
 *         description: An error occurred while updating airport
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const airportData: Airport = await req.json()
    const { airportCollection } = await getDatabase()

    const updatedAirport = await airportCollection.upsert(
      airportId,
      airportData
    )
    if (updatedAirport) {
      return NextResponse.json(
        {
          airportId: airportId,
          airportData: airportData,
          updatedAirport: updatedAirport,
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: "Airport not found", error: "Airport not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating airport",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/airport/{airportId}:
 *   delete:
 *     summary: Delete an airport
 *     description: |
 *       Delete an airport with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to delete a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airport/[airportId]/route.ts` Method: `DELETE`
 *     tags:
 *       - Airport
 *     responses:
 *       202:
 *         description: Successfully deleted the airport
 *       404:
 *         description: Airport not found
 *       500:
 *         description: An error occurred while deleting airport
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const { airportCollection } = await getDatabase()

    const deletedAirport = await airportCollection.remove(airportId)
    if (deletedAirport) {
      return NextResponse.json(
        { message: "Successfully deleted airport" },
        { status: 202 }
      )
    } else {
      return NextResponse.json(
        {
          message: "Airport not found",
          error: "Airport not found",
        },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while deleting airport",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Geo:
 *       type: object
 *       properties:
 *         alt:
 *           type: number
 *         lat:
 *           type: number
 *         lon:
 *           type: number
 *
 *     Airport:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         type:
 *           type: string
 *         airportname:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         faa:
 *           type: string
 *         icao:
 *           type: string
 *         tz:
 *           type: string
 *         geo:
 *           $ref: '#/components/schemas/Geo'
 */
