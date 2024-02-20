import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/airport/{airportId}:
 *   get:
 *     summary: Get airport route
 *     parameters:
 *       - in: path
 *         name: airportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with airport data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       '400':
 *         description: Failed to fetch airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
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
        { message: "Failed to fetch airport" },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching airport" },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/airport/{airportId}:
 *   post:
 *     summary: Create airport route
 *     parameters:
 *       - in: path
 *         name: airportId
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
 *       '201':
 *         description: Successful response with created airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       '400':
 *         description: Failed to create airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
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

    const airportData = req.body
    const { airportCollection } = await getDatabase()

    const createdAirport = await airportCollection.insert(
      airportId,
      airportData
    )
    if (createdAirport) {
      return NextResponse.json(createdAirport, { status: 201 })
    } else {
      return NextResponse.json(
        { message: "Failed to create airport" },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while creating airport" },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/airport/{airportId}/route:
 *   put:
 *     summary: Update airport route
 *     parameters:
 *       - in: path
 *         name: airportId
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
 *       '200':
 *         description: Successful response with updated airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       '400':
 *         description: Failed to update airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
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
    const airportData = req.body
    const { airportCollection } = await getDatabase()

    const updatedAirport = await airportCollection.replace(
      airportId,
      airportData
    )
    if (updatedAirport) {
      return NextResponse.json(updatedAirport, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Failed to update airport" },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while updating airport" },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/airport/{airportId}/route:
 *   delete:
 *     summary: Delete airport route
 *     parameters:
 *       - in: path
 *         name: airportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with deleted airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       '400':
 *         description: Failed to delete airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
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
      return NextResponse.json(deletedAirport, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Failed to delete airport" },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while deleting airport" },
      { status: 500 }
    )
  }
}
