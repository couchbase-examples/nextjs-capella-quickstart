import { NextRequest, NextResponse } from "next/server"
import { DocumentExistsError, DocumentNotFoundError } from "couchbase"
import { ZodError } from "zod"

import { getDatabase } from "@/lib/couchbase-connection"
import { AirportSchema, TAirport } from "@/app/models/Airport"

/**
 * @swagger
 * /api/v1/airport/{airportId}:
 *   get:
 *     summary: Get an airport by ID
 *     description: |
 *       Get airport with specified ID.
 *
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to get a document with specified ID.
 *
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *
 *       Code: `airport/[airportId]/route.ts`
 *
 *       Method: `GET`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
 *         example: 'airport_1254'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       404:
 *         description: Airport not found
 *       500:
 *         description: An error occurred while fetching airport
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ airportId: string }> }
) {
  try {
    const { airportId } = await params
    const { airportCollection } = await getDatabase()

    const airport = await airportCollection.get(airportId)
    return NextResponse.json(airport.content as TAirport, { status: 200 })
  } catch (error) {
    
    if (error instanceof DocumentNotFoundError) {
      return NextResponse.json(
        { message: "Airport not found", error: "Airport not found" },
        { status: 404 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while fetching airport",
          error: "An error occurred while fetching airport",
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * /api/v1/airport/{airportId}:
 *   post:
 *     summary: Create an airport
 *     description: |
 *       Create an airport with specified ID.
 *
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to create a document with specified ID.
 *
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *
 *       Code: `airport/[airportId]/route.ts`
 *
 *       Method: `POST`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
 *         example: 'airport_1254'
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airport'
 *     responses:
 *       201:
 *         description: Returns the created airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Airport already exists
 *       500:
 *         description: An error occurred while creating airport
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ airportId: string }> }
) {
  try {
    const { airportId } = await params
    const airportData: TAirport = await req.json()
    const parsedAirportData = AirportSchema.parse(airportData)
    const { airportCollection } = await getDatabase()

    await airportCollection.insert(airportId, parsedAirportData)
    return NextResponse.json(parsedAirportData, { status: 201 })
  } catch (error) {
    
    if (error instanceof DocumentExistsError) {
      return NextResponse.json(
        {
          message: "Airport already exists",
          error: "Airport already exists",
        },
        { status: 409 }
      )
    } else if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          error: error.issues,
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while creating airport",
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * /api/v1/airport/{airportId}:
 *   put:
 *     summary: Update an airport
 *     description: |
 *       Update an airport with specified ID.
 *
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to update a document with specified ID.
 *
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *
 *       Code: `airport/[airportId]/route.ts`
 *
 *       Method: `PUT`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
 *         example: 'airport_1254'
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airport'
 *     responses:
 *       200:
 *         description: Returns the updated airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: An error occurred while updating airport
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ airportId: string }> }
) {
  try {
    const { airportId } = await params
    const airportData: TAirport = await req.json()
    const parsedAirportData = AirportSchema.parse(airportData)
    const { airportCollection } = await getDatabase()

    await airportCollection.upsert(airportId, parsedAirportData)
    return NextResponse.json({ parsedAirportData }, { status: 200 })
  } catch (error) {
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request body", error: error.issues },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while updating airport",
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * /api/v1/airport/{airportId}:
 *   delete:
 *     summary: Delete an airport
 *     description: |
 *       Delete an airport with specified ID.
 *
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to delete a document with specified ID.
 *
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *
 *       Code: `airport/[airportId]/route.ts`
 *
 *       Method: `DELETE`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
 *         example: 'airport_1254'
 *         schema:
 *           type: string
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
  { params }: { params: Promise<{ airportId: string }> }
) {
  try {
    const { airportId } = await params
    const { airportCollection } = await getDatabase()

    await airportCollection.remove(airportId)
    return NextResponse.json(
      { message: "Successfully deleted airport" },
      { status: 202 }
    )
  } catch (error) {
    
    if (error instanceof DocumentNotFoundError) {
      return NextResponse.json(
        {
          message: "Airport not found",
          error: "Airport not found",
        },
        { status: 404 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while deleting airport",
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Airport:
 *       type: object
 *       properties:
 *         airportname:
 *           type: string
 *           example: 'John F. Kennedy International Airport'
 *         city:
 *           type: string
 *           example: 'New York'
 *         country:
 *           type: string
 *           example: 'United States'
 *         faa:
 *           type: string
 *           example: 'JFK'
 *         icao:
 *           type: string
 *           example: 'KJFK'
 *         tz:
 *           type: string
 *           example: 'America/New_York'
 *         geo:
 *           $ref: '#/components/schemas/Geo'
 *       required:
 *         - airportname
 *         - city
 *         - country
 *         - faa
 *         - icao
 *         - tz
 *         - geo
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Geo:
 *       type: object
 *       properties:
 *         alt:
 *           type: number
 *           example: 13
 *         lat:
 *           type: number
 *           example: 40.63980103
 *         lon:
 *           type: number
 *           example: -73.77890015
 */
