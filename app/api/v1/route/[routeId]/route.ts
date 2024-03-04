import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/v1/route/{routeId}:
 *   get:
 *     summary: Get a route by ID
 *     description: Get a route by ID
 *     tags:
 *       - Route
 *     parameters:
 *       - name: routeId
 *         in: path
 *         description: ID of the route
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the route
 *       400:
 *         description: Failed to fetch route
 *       500:
 *         description: An error occurred while fetching route
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const { routeCollection } = await getDatabase()

    const route = await routeCollection.get(routeId)
    if (route) {
      return NextResponse.json(route.content, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Failed to fetch route", error: "Route not found" },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching route",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/v1/route/{routeId}:
 *   post:
 *     summary: Create a route
 *     description: Create a route
 *     tags:
 *       - Route
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Returns the created route
 *       400:
 *         description: Failed to create route
 *       500:
 *         description: An error occurred while creating route
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const routeData = await req.json()
    const { routeCollection } = await getDatabase()

    const createdRoute = await routeCollection.insert(routeId, routeData)
    if (createdRoute) {
      return NextResponse.json(
        {
          routeId: routeId,
          routeData: routeData,
          createdRoute: createdRoute,
        },
        {
          status: 201,
        }
      )
    } else {
      return NextResponse.json(
        {
          message: "Failed to create route",
          error: "Route could not be created",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while creating route",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/v1/route/{routeId}:
 *   put:
 *     summary: Update a route
 *     description: Update a route
 *     tags:
 *       - Route
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Returns the updated route
 *       400:
 *         description: Failed to update route
 *       500:
 *         description: An error occurred while updating route
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const routeData = await req.json()
    const { routeCollection } = await getDatabase()

    const updatedRoute = await routeCollection.upsert(routeId, routeData)
    if (updatedRoute) {
      return NextResponse.json(
        {
          routeId: routeId,
          routeData: routeData,
          updatedRoute: updatedRoute,
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: "Failed to update route", error: "Route not found" },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating route",
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/v1/route/{routeId}:
 *   delete:
 *     summary: Delete a route
 *     description: Delete a route
 *     tags:
 *       - Route
 *     responses:
 *       204:
 *         description: Successfully deleted the route
 *       400:
 *         description: Failed to delete route
 *       500:
 *         description: An error occurred while deleting route
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const { routeCollection } = await getDatabase()

    const deletedRoute = await routeCollection.remove(routeId)
    if (deletedRoute) {
      return NextResponse.json(
        { message: "Successfully deleted route" },
        { status: 204 }
      )
    } else {
      return NextResponse.json(
        {
          message: "Failed to delete route",
          error: "Route could not be deleted",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while deleting route",
      },
      { status: 500 }
    )
  }
}
