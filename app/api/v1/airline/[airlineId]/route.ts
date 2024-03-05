import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"
import { Airline } from "@/app/models/Airline"

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
    if (airline) {
      return NextResponse.json(airline.content as Airline, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Airline not found", error: "Airline not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching airline",
      },
      { status: 500 }
    )
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airline'
 *     responses:
 *       201:
 *         description: Returns the created airline
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
    const airlineData: Airline = await req.json()
    const { airlineCollection } = await getDatabase()

    const createdAirline = await airlineCollection.insert(
      airlineId,
      airlineData
    )
    if (createdAirline) {
      return NextResponse.json(
        {
          airlineId: airlineId,
          airlineData: airlineData,
          createdAirline: createdAirline,
        },
        {
          status: 201,
        }
      )
    } else {
      return NextResponse.json(
        {
          message: "Airline already exists",
          error: "Airline already exists",
        },
        { status: 409 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while creating airline",
      },
      { status: 500 }
    )
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Airline'
 *     responses:
 *       200:
 *         description: Returns the updated airline
 *       404:
 *         description: Airline not found
 *       500:
 *         description: An error occurred while updating airline
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const airlineData: Airline = await req.json()
    const { airlineCollection } = await getDatabase()

    const updatedAirline = await airlineCollection.upsert(
      airlineId,
      airlineData
    )
    if (updatedAirline) {
      return NextResponse.json(
        {
          airlineId: airlineId,
          airlineData: airlineData,
          updatedAirline: updatedAirline,
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: "Airline not found", error: "Airline not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating airline",
      },
      { status: 500 }
    )
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

    const deletedAirline = await airlineCollection.remove(airlineId)
    if (deletedAirline) {
      return NextResponse.json(
        { message: "Successfully deleted airline" },
        { status: 202 }
      )
    } else {
      return NextResponse.json(
        {
          message: "Airline not found",
          error: "Airline not found",
        },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while deleting airline",
      },
      { status: 500 }
    )
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