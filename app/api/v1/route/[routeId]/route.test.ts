import { NextRequest } from "next/server"
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest"

import { getDatabase } from "@/lib/couchbase-connection"
import { Route } from "@/app/models/Route"

import {
  DELETE as deleteHandler,
  GET as getHandler,
  POST as postHandler,
  PUT as putHandler,
} from "./route"

const insertRoute = async (id: string, route: Route) => {
  const { routeCollection } = await getDatabase()
  await routeCollection.insert(id, route)
}

const cleanupRoute = async (id: string) => {
  const { routeCollection } = await getDatabase()
  await routeCollection.remove(id)
}

afterAll(async () => {
  const { cluster } = await getDatabase()
  await cluster.close()
})

describe("GET /api/v1/route/{id}", () => {
  const id = "route_10209"

  const expectedRoute = {
    id: 10209,
    type: "route",
    airline: "AH",
    airlineid: "airline_794",
    sourceairport: "MRS",
    destinationairport: "TLM",
    stops: 0,
    equipment: "736",
    schedule: [
      { day: 0, utc: "22:18:00", flight: "AH705" },
      { day: 0, utc: "08:47:00", flight: "AH413" },
      { day: 0, utc: "04:25:00", flight: "AH284" },
      { day: 1, utc: "10:05:00", flight: "AH800" },
      { day: 1, utc: "04:59:00", flight: "AH448" },
      { day: 1, utc: "20:17:00", flight: "AH495" },
      { day: 1, utc: "08:30:00", flight: "AH837" },
      { day: 2, utc: "08:32:00", flight: "AH344" },
      { day: 2, utc: "06:28:00", flight: "AH875" },
      { day: 3, utc: "21:15:00", flight: "AH781" },
      { day: 4, utc: "12:57:00", flight: "AH040" },
      { day: 5, utc: "23:09:00", flight: "AH548" },
      { day: 6, utc: "22:47:00", flight: "AH082" },
      { day: 6, utc: "06:12:00", flight: "AH434" },
      { day: 6, utc: "13:10:00", flight: "AH831" },
      { day: 6, utc: "02:48:00", flight: "AH144" },
      { day: 6, utc: "22:39:00", flight: "AH208" },
    ],
    distance: 1097.2184613947677,
  }

  it("should respond with status code 200 OK and return route as object", async () => {
    const response = await getHandler({} as NextRequest, {
      params: { routeId: id },
    })
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody).toEqual(expectedRoute)
  })
})

describe("POST /api/v1/route", () => {
  const routeId = "route_post"
  const newRoute: Route = {
    id: 10001,
    type: "route",
    airline: "AF",
    airlineid: "airline_137",
    sourceairport: "TLV",
    destinationairport: "MRS",
    stops: 0,
    equipment: "320",
    schedule: [
      { day: 0, utc: "10:13:00", flight: "AF198" },
      { day: 0, utc: "19:14:00", flight: "AF547" },
      // Add more schedule items as needed
    ],
    distance: 2881.617376098415,
  }

  it("should respond with status code 201 Created and return route as object", async () => {
    const response = await postHandler(
      { json: async () => newRoute } as NextRequest,
      { params: { routeId: routeId } }
    )
    const responseBody = await response.json()

    expect(response.status).toBe(201)
    expect(responseBody.routeId).toBe(routeId)
    expect(responseBody.routeData).toEqual(newRoute)
  })

  // Clean up route after running tests
  afterEach(async () => {
    await cleanupRoute(routeId)
  })
})

describe("PUT /api/v1/route/{id}", () => {
  const id = "route_put"

  // Insert route before running tests
  beforeEach(async () => {
    await insertRoute(id, {
      id: 999,
      type: "route",
      airline: "AF",
      airlineid: "airline_137",
      sourceairport: "TLV",
      destinationairport: "MRS",
      stops: 0,
      equipment: "320",
      schedule: [
        { day: 0, utc: "10:13:00", flight: "AF198" },
        { day: 0, utc: "19:14:00", flight: "AF547" },
        // Add more schedule items as needed
      ],
      distance: 2881.617376098415,
    })
  })

  const updatedRoute: Route = {
    id: 9999,
    type: "route",
    airline: "AF",
    airlineid: "airline_137",
    sourceairport: "TLV",
    destinationairport: "MRS",
    stops: 0,
    equipment: "320",
    schedule: [
      { day: 0, utc: "10:13:00", flight: "AF198" },
      { day: 0, utc: "19:14:00", flight: "AF547" },
      // Add more schedule items as needed
    ],
    distance: 3000,
  }

  it("should respond with status code 200 OK and return updated route as object", async () => {
    const response = await putHandler(
      { json: async () => updatedRoute } as NextRequest,
      { params: { routeId: id } }
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const responseBody = await response.json()

    expect(responseBody.routeId).toBe(id)
    expect(responseBody.routeData).toEqual(updatedRoute)
  })

  // Clean up route after running tests
  afterEach(async () => {
    await cleanupRoute(id)
  })
})

describe("DELETE /api/v1/route/{id}", () => {
  const id = "route_delete"

  // Insert route before running tests
  insertRoute(id, {
    id: 10003,
    type: "route",
    airline: "AF",
    airlineid: "airline_137",
    sourceairport: "TLV",
    destinationairport: "MRS",
    stops: 0,
    equipment: "320",
    schedule: [
      { day: 0, utc: "10:13:00", flight: "AF198" },
      { day: 0, utc: "19:14:00", flight: "AF547" },
      // Add more schedule items as needed
    ],
    distance: 2881.617376098415,
  })

  it("should respond with status code 202 Accepted", async () => {
    const response = await deleteHandler({} as NextRequest, {
      params: { routeId: id },
    })

    expect(response.status).toBe(202)
  })
})
