import { NextRequest, NextResponse } from "next/server";

import { RouteSchema, TRoute } from "@/app/models/Route";
import { getDatabase } from "@/lib/couchbase-connection";

import { DocumentExistsError, DocumentNotFoundError } from 'couchbase';
import { ZodError } from "zod";

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
 *       Code: `route/[routeId]/route.ts`  
 * 
 *       Method: `GET`
 *     tags:
 *       - Route
 *     parameters:
 *       - name: routeId
 *         in: path
 *         description: ID of the route
 *         required: true
 *         example: 'route_10000'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the route
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
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
    return NextResponse.json(route.content as TRoute, { status: 200 })
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return NextResponse.json(
        { message: "Route not found", error: "Route not found" },
        { status: 404 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while fetching route",
        },
        { status: 500 }
      )
    }
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
 *       Code: `route/[routeId]/route.ts`  
 * 
 *       Method: `POST`
 *     tags:
 *       - Route
 *     parameters:
 *       - name: routeId
 *         in: path
 *         description: ID of the route
 *         required: true
 *         example: 'route_10000'
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       201:
 *         description: Returns the created route
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid request body
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
    const routeData: TRoute = await req.json()
    const parsedRouteData = RouteSchema.parse(routeData)

    const { routeCollection } = await getDatabase()

    await routeCollection.insert(routeId, parsedRouteData)
    return NextResponse.json(parsedRouteData, { status: 201 })
  } catch (error) {
    if (error instanceof DocumentExistsError) {
      return NextResponse.json(
        {
          message: "Route already exists",
          error: "Route already exists",
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
          message: "An error occurred while creating route",
        },
        { status: 500 }
      )
    }
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
 *       Code: `route/[routeId]/route.ts`  
 * 
 *       Method: `PUT`
 *     tags:
 *       - Route
 *     parameters:
 *       - name: routeId
 *         in: path
 *         description: ID of the route
 *         required: true
 *         example: 'route_10000'
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       200:
 *         description: Returns the updated route
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: An error occurred while updating route
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params
    const routeData: TRoute = await req.json()
    const parsedRouteData = RouteSchema.parse(routeData)
    const { routeCollection } = await getDatabase()

    await routeCollection.upsert(routeId, parsedRouteData)
    return NextResponse.json({ parsedRouteData }, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request body", error: error.errors },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while updating route",
        },
        { status: 500 }
      )
    }
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
 *       Code: `route/[routeId]/route.ts`  
 * 
 *       Method: `DELETE`
 *     tags:
 *       - Route
 *     parameters:
 *       - name: routeId
 *         in: path
 *         description: ID of the route
 *         required: true
 *         example: 'route_10000'
 *         schema:
 *           type: string
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

    await routeCollection.remove(routeId)
    return NextResponse.json(
      { message: "Successfully deleted route" },
      { status: 202 }
    )
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return NextResponse.json(
        {
          message: "Route not found",
          error: "Route not found",
        },
        { status: 404 }
      )
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while deleting route",
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
 *           example: 1
 *         type:
 *           type: string
 *           example: 'route'
 *         airline:
 *           type: string
 *           example: 'Delta Air Lines'
 *         airlineid:
 *           type: string
 *           example: 'DL'
 *         sourceairport:
 *           type: string
 *           example: 'JFK'
 *         destinationairport:
 *           type: string
 *           example: 'LAX'
 *         stops:
 *           type: number
 *           example: 0
 *         equipment:
 *           type: string
 *           example: 'Boeing 737'
 *         schedule:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Schedule'
 *           example:
 *             - day: 1
 *               flight: 'DL101'
 *               utc: '08:00'
 *             - day: 2
 *               flight: 'DL102'
 *               utc: '12:00'
 *         distance:
 *           type: number
 *           example: 2475
 *       required:
 *         - airline
 *         - airlineid
 *         - sourceairport
 *         - destinationairport
 *         - stops
 *         - equipment
 *         - schedule
 *         - distance
 */
