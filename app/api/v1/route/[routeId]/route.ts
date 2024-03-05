import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"
import { Route } from "@/app/models/Route"

/**
 * @swagger
 * /api/v1/route/{routeId}:
 *   get:
 *     summary: Get a route by ID
 *     description: |
 *       Get route with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to get a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `route/[routeId]/route.ts` Method: `GET`
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
 *       404:
 *         description: Route not found
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
      return NextResponse.json(route.content as Route, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Route not found", error: "Route not found" },
        { status: 404 }
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
 *     description: |
 *       Create a route with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to create a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `route/[routeId]/route.ts` Method: `POST`
 *     tags:
 *       - Route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       201:
 *         description: Returns the created route
 *       409:
 *         description: Route already exists
 *       500:
 *         description: An error occurred while creating route
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const routeData: Route = await req.json()
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
          message: "Route already exists",
          error: "Route already exists",
        },
        { status: 409 }
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
 *     description: |
 *       Update a route with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to update a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `route/[routeId]/route.ts` Method: `PUT`
 *     tags:
 *       - Route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       200:
 *         description: Returns the updated route
 *       404:
 *         description: Route not found
 *       500:
 *         description: An error occurred while updating route
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const routeData:Route = await req.json()
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
        { message: "Route not found", error: "Route not found" },
        { status: 404 }
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
 *     description: |
 *       Delete a route with specified ID.
 *       
 *       This provides an example of using [Key Value operations](https://docs.couchbase.com/nodejs-sdk/current/howtos/kv-operations.html) in Couchbase to delete a document with specified ID.
 *       
 *       Key Value operations are unique to Couchbase and provide very high-speed get/set/delete operations.
 *       
 *       Code: `route/[routeId]/route.ts` Method: `DELETE`
 *     tags:
 *       - Route
 *     responses:
 *       202:
 *         description: Successfully deleted the route
 *       404:
 *         description: Route not found
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
        { status: 202 }
      )
    } else {
      return NextResponse.json(
        {
          message: "Route not found",
          error: "Route not found",
        },
        { status: 404 }
      )
    }
  }
  catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while deleting route",
      },
      { status: 500 }
    )
  }
}


/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         day:
 *           type: number
 *         flight:
 *           type: string
 *         utc:
 *           type: string
 *
 *     Route:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         type:
 *           type: string
 *         airline?:
 *           type: string
 *         airlineid?:
 *           type: string
 *         sourceairport?:
 *           type: string
 *         destinationairport?:
 *           type: string
 *         stops?:
 *           type: number
 *         equipment?:
 *           type: string
 *         schedule?:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Schedule'
 *         distance?:
 *           type: number
 */
