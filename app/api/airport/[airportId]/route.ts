import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/airport/{airportId}:
 *   get:
 *     summary: Get an airport by ID
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       400:
 *         description: Failed to fetch airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while fetching airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
      return NextResponse.json(airport.content, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Failed to fetch airport", error: "Airport not found" },
        { status: 400 }
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
 *         description: Failed to create airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while creating airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const airportData = await req.json()
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
          message: "Failed to create airport",
          error: "Airport could not be created",
        },
        { status: 400 }
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
 *         description: Failed to update airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while updating airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { airportId: string } }
) {
  try {
    const { airportId } = params
    const airportData = await req.json()
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
        { message: "Failed to update airport", error: "Airport not found" },
        { status: 400 }
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
 *     responses:
 *       204:
 *         description: Successfully deleted the airport
 *       400:
 *         description: Failed to delete airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while deleting airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
        { status: 204 }
      )
    } else {
      return NextResponse.json(
        {
          message: "Failed to delete airport",
          error: "Airport could not be deleted",
        },
        { status: 400 }
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
