import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"
import { TAirline,AirlineSchema } from "@/app/models/Airline"
import { DocumentNotFoundError,DocumentExistsError } from 'couchbase';

import { ZodError } from "zod";

/**
 * @swagger
 * /api/v1/airline/{airlineId}:
 *   get:
 *     summary: Get an airline by ID
 *     description: |
 *       Get Airline with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to get a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airline/[airlineId]/route.ts` Method: `GET`
 *     tags:
 *        - Airline
 *     parameters:
 *       - name: airlineId
 *         in: path
 *         description: ID of the airline
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the airline
 *       404:
 *         description: Airline not found
 *       500:
 *         description: An error occurred while fetching airline
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const { airlineCollection } = await getDatabase()

    const airline = await airlineCollection.get(airlineId)
    return NextResponse.json(airline.content as TAirline, { status: 200 })
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return NextResponse.json(
        { message: "Airline not found", error: "Airline not found" },
        { status: 404 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while fetching airline",
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * /api/v1/airline/{airlineId}:
 *   post:
 *     summary: Create an airline
 *     description: |
 *       Create an airline with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to create a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airline/[airlineId]/route.ts` Method: `POST`
 *     tags:
 *        - Airline
 *     parameters:
 *       - name: airlineId
 *         in: path
 *         description: ID of the airline
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airline'
 *     responses:
 *       201:
 *         description: Returns the created airline
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Airline already exists
 *       500:
 *         description: An error occurred while creating airline
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const airlineData: TAirline = await req.json()
    const parsedAirlineData = AirlineSchema.parse(airlineData)
    const { airlineCollection } = await getDatabase()

    const createdAirline = await airlineCollection.insert(
      airlineId,
      parsedAirlineData
    )
    return NextResponse.json(
      {
        airlineId: airlineId,
        airlineData: parsedAirlineData,
        createdAirline: createdAirline,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    if (error instanceof DocumentExistsError) {
      return NextResponse.json(
        {
          message: "Airline already exists",
          error: "Airline already exists",
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
          message: "An error occurred while creating airline",
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * /api/v1/airline/{airlineId}:
 *   put:
 *     summary: Update an airline
 *     description: |
 *       Update an airline with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to update a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airline/[airlineId]/route.ts` Method: `PUT`
 *     tags:
 *        - Airline
 *     parameters:
 *       - name: airlineId
 *         in: path
 *         description: ID of the airline
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airline'
 *     responses:
 *       200:
 *         description: Returns the updated airline
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: An error occurred while updating airline
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const airlineData: TAirline = await req.json()
    const parsedAirlineData = AirlineSchema.parse(airlineData)
    const { airlineCollection } = await getDatabase()

    const updatedAirline = await airlineCollection.upsert(
      airlineId,
      parsedAirlineData
    )
    return NextResponse.json(
      {
        airlineId: airlineId,
        airlineData: parsedAirlineData,
        updatedAirline: updatedAirline,
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
          message: "An error occurred while updating airline",
          error: "An error occurred while updating airline"
        },
        { status: 500 }
      )
    }
  }
}

/**
 * @swagger
 * /api/v1/airline/{airlineId}:
 *   delete:
 *     summary: Delete an airline
 *     description: |
 *       Delete an airline with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to delete a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `airline/[airlineId]/route.ts` Method: `DELETE`
 *     tags:
 *        - Airline
 *     parameters:
 *       - name: airlineId
 *         in: path
 *         description: ID of the airline
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Successfully deleted the airline
 *       404:
 *         description: Airline not found
 *       500:
 *         description: An error occurred while deleting airline
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const { airlineCollection } = await getDatabase()

    await airlineCollection.remove(airlineId)
    return NextResponse.json(
      { message: "Successfully deleted airline" },
      { status: 202 }
    )
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return NextResponse.json(
        {
          message: "Airline not found",
          error: "Airline not found",
        },
        { status: 404 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while deleting airline",
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
 *     Airline:
 *       type: object
 *       properties:
 *         callsign:
 *           type: string
 *         country:
 *           type: string
 *         iata:
 *           type: string
 *         icao:
 *           type: string
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
 */