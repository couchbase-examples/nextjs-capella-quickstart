import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"
import { AirportSchema, TAirport } from "@/app/models/Airport"

import { DocumentNotFoundError, DocumentExistsError } from 'couchbase';
import { ZodError } from "zod";

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
          error: "An error occurred while fetching airport"
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
 *       Code: `airport/[airportId]/route.ts` Method: `POST`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
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
 *       400:
 *         description: Invalid request body
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
    const airportData: TAirport = await req.json()
    const parsedAirportData = AirportSchema.parse(airportData)
    const { airportCollection } = await getDatabase()

    const createdAirport = await airportCollection.insert(
      airportId,
      parsedAirportData
    )
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
          error: error.errors,
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
 *       Code: `airport/[airportId]/route.ts` Method: `PUT`
 *     tags:
 *       - Airport
 *     parameters:
 *       - name: airportId
 *         in: path
 *         description: ID of the airport
 *         required: true
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
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: An error occurred while updating airport
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const airportData: TAirport = await req.json()
    const parsedAirportData = AirportSchema.parse(airportData)
    const { airportCollection } = await getDatabase()

    const updatedAirport = await airportCollection.upsert(
      airportId,
      parsedAirportData
    )
    return NextResponse.json(
      {
        airportId: airportId,
        airportData: parsedAirportData,
        updatedAirport: updatedAirport,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request body", error: error.errors },
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
 *       Code: `airport/[airportId]/route.ts` Method: `DELETE`
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
