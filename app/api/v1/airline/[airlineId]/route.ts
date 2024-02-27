import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/v1/airline/{airlineId}:
 *   get:
 *     summary: Get an airline by ID
 *     description: Get an airline by ID
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airline'
 *       400:
 *         description: Failed to fetch airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while fetching airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
      return NextResponse.json(airline.content, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Failed to fetch airline", error: "Airline not found" },
        { status: 400 }
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
 *     description: Get an airline by ID
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airline'
 *       400:
 *         description: Failed to create airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while creating airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const airlineData = await req.json()
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
          message: "Failed to create airline",
          error: "Airline could not be created",
        },
        { status: 400 }
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
 *     description: Get an airline by ID
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airline'
 *       400:
 *         description: Failed to update airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while updating airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { airlineId: string } }
) {
  try {
    const { airlineId } = params
    const airlineData = await req.json()
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
        { message: "Failed to update airline", error: "Airline not found" },
        { status: 400 }
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
 *     description: Get an airline by ID
 *     tags:
 *        - Airline
 *     responses:
 *       204:
 *         description: Successfully deleted the airline
 *       400:
 *         description: Failed to delete airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while deleting airline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
        { status: 204 }
      )
    } else {
      return NextResponse.json(
        {
          message: "Failed to delete airline",
          error: "Airline could not be deleted",
        },
        { status: 400 }
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
