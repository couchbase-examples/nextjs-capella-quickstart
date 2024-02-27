import { NextRequest } from "next/server"
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest"

import { Airline } from "@/app/models/AirlineModel"

import { getDatabase } from "@/lib/couchbase-connection"
import {
  DELETE as deleteHandler,
  GET as getHandler,
  POST as postHandler,
  PUT as putHandler,
} from "./route"

const insertAirline = async (id: string, airline: Airline) => {
  const { airlineCollection } = await getDatabase()
  await airlineCollection.insert(id, airline)
}

const cleanupAirline = async (id: string) => {
  const { airlineCollection } = await getDatabase()
  await airlineCollection.remove(id)
}

afterAll(async () => {
  const { cluster } = await getDatabase()
  await cluster.close()
})

describe("GET /api/v1/airline/{id}", () => {
  const id = "airline_10"
  const expectedAirline: Airline = {
    id: 10,
    type: "airline",
    name: "40-Mile Air",
    iata: "Q5",
    icao: "MLA",
    callsign: "MILE-AIR",
    country: "United States",
  }

  it("should respond with status code 200 OK and return airline as object", async () => {
    const response = await getHandler({} as NextRequest, {
      params: { airlineId: id },
    })
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody).toEqual(expectedAirline)
  })
})

describe("POST /api/v1/airline", () => {
  const id = "airline_post"
  const newAirline: Airline = {
    id: 11,
    type: "airline",
    name: "40-Mile Air",
    iata: "Q5",
    icao: "MLA",
    callsign: "MILE-AIR",
    country: "United States",
  }

  it("should respond with status code 201 Created and return airline as object", async () => {
    const response = await postHandler(
      { json: async () => newAirline } as NextRequest,
      { params: { airlineId: id } }
    )
    const responseBody = await response.json()

    expect(response.status).toBe(201)
    expect(responseBody.airlineId).toBe(id)
    expect(responseBody.airlineData).toEqual(newAirline)
  })

  // Clean up airline after running tests
  afterEach(async () => {
    const { airlineCollection } = await getDatabase()
    await airlineCollection.remove(id)
  })
})

describe("PUT /api/v1/airline/{id}", () => {
  const id = "airline_put"

  // Insert airline before running tests
  beforeEach(async () => {
    await insertAirline(id, {
      id: 11,
      type: "airline",
      name: "40-Mile Air",
      iata: "Q5",
      icao: "MLA",
      callsign: "MILE-AIR",
      country: "United States",
    })
  })

  const updatedAirline: Airline = {
    id: 11,
    type: "airline",
    name: "40-Mile Air",
    iata: "Q5",
    icao: "MLA",
    callsign: "MILE-AIR",
    country: "United States",
  }

  it("should respond with status code 200 OK and return updated airline as object", async () => {
    const response = await putHandler(
      { json: async () => updatedAirline } as NextRequest,
      { params: { airlineId: id } }
    )
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody.airlineId).toBe(id)
    expect(responseBody.airlineData).toEqual(updatedAirline)
  })

  // Clean up airline after running tests
  afterEach(async () => {
    await cleanupAirline(id)
  })
})

describe("DELETE /api/v1/airline/{id}", () => {
  const id = "airline_delete"

  // Insert airline before running tests
  beforeEach(async () => {
    await insertAirline(id, {
      id: 11,
      type: "airline",
      name: "40-Mile Air",
      iata: "Q5",
      icao: "MLA",
      callsign: "MILE-AIR",
      country: "United States",
    })
  })

  it("should respond with status code 204 No Content", async () => {
    const response = await deleteHandler({} as NextRequest, {
      params: { airlineId: id },
    })

    expect(response.status).toBe(204)
  })
})
