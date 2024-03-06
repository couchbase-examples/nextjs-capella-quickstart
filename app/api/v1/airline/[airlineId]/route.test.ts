import { NextRequest } from "next/server"
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest"

import { TAirline } from "@/app/models/Airline"

import { getDatabase } from "@/lib/couchbase-connection"
import {
  DELETE as deleteHandler,
  GET as getHandler,
  POST as postHandler,
  PUT as putHandler,
} from "./route"

import { DocumentExistsError,DocumentNotFoundError } from "couchbase"

const insertAirline = async (id: string, airline: TAirline) => {
  try {
    const { airlineCollection } = await getDatabase()
    await airlineCollection.insert(id, airline)
  } catch (error) {
    if (error instanceof DocumentExistsError) {
      console.warn(`Airline with id ${id} already exists during insertion.`)
    } else {
      console.warn(`An error occurred while inserting the airline: ${error}`)
    }
  }
}

const cleanupAirline = async (id: string) => {
  try {
    const { airlineCollection } = await getDatabase()
    await airlineCollection.remove(id)
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      console.warn(`Airline with id ${id} does not exist during cleanup.`)
    } else {
      console.warn(`An error occurred while removing the airline: ${error}`)
    }
  }
}

afterAll(async () => {
  const { cluster } = await getDatabase()
  await cluster.close()
})

describe("GET /api/v1/airline/{id}", () => {
  const id = "airline_10"
  const expectedAirline: TAirline = {
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

  it("should respond with status code 404 when the airline ID is invalid", async () => {
    const invalidAirlineId = "invalid_airline_id"
    const response = await getHandler({} as NextRequest, {
      params: { airlineId: invalidAirlineId },
    })
    const responseBody = await response.json()

    expect(response.status).toBe(404)
    expect(responseBody).toEqual({ message: "Airline not found", error: "Airline not found" })
  })

})

describe("POST /api/v1/airline", () => {
  const id = "airline_post"
  const newAirline: TAirline = {
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

  it("should respond with status code 400 Bad Request when the request body is invalid", async () => {
    const invalidAirlineData = { "invalid": "data"}
    const response = await postHandler(
      { json: async () => invalidAirlineData } as NextRequest,
      { params: { airlineId: id } }
    )
    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe("Invalid request body")
  });

  it("should respond with status code 409 Conflict when the airline ID already exists", async () => {

    await insertAirline(id, newAirline);

    const response = await postHandler(
      { json: async () => newAirline } as NextRequest,
      { params: { airlineId: id } }
    )
    const responseBody = await response.json()

    expect(response.status).toBe(409)
    expect(responseBody).toEqual({ message: "Airline already exists", error: "Airline already exists" })
  });

  // Clean up airline after running tests
  afterEach(async () => {
    await cleanupAirline(id)
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

  const updatedAirline: TAirline = {
    id: 11,
    type: "airline",
    name: "40-Mile Air",
    iata: "U5",
    icao: "UPD",
    callsign: "MILE-AIR",
    country: "Updated States",
  }

  it("should respond with status code 200 OK and return updated airline as object", async () => {

    const response = await putHandler(
      { json: async () => updatedAirline } as NextRequest,
      { params: { airlineId: id } }
    )

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const responseBody = await response.json()

    expect(responseBody.airlineId).toBe(id)
    expect(responseBody.airlineData).toEqual(updatedAirline)
  })

  it("should respond with status code 400 Bad Request when the airline ID is invalid", async () => {
    const invalidAirlineData = { "invalid": "data"}
    const response = await putHandler(
      { json: async () => invalidAirlineData } as NextRequest,
      { params: { airlineId: id } }
    )
    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe("Invalid request body")
  });

  // Clean up airline after running tests
  afterEach(async () => {
    await cleanupAirline(id)
  })
})

describe("DELETE /api/v1/airline/{id}", () => {
  const id = "airline_delete"

  // Insert airline before running tests
  insertAirline(id, {
    id: 11,
    type: "airline",
    name: "40-Mile Air",
    iata: "Q5",
    icao: "MLA",
    callsign: "MILE-AIR",
    country: "United States",
  })

  it("should respond with status code 202 Accepted", async () => {
    const response = await deleteHandler({} as NextRequest, {
      params: { airlineId: id },
    })

    expect(response.status).toBe(202)
  })

  it("should respond with status code 404 Not Found when the airline ID is invalid", async () => {
    const invalidAirlineId = "invalid_airline_id"
    const response = await deleteHandler({} as NextRequest, {
      params: { airlineId: invalidAirlineId },
    })
    const responseBody = await response.json()

    expect(response.status).toBe(404)
    expect(responseBody).toEqual({ message: "Airline not found", error: "Airline not found" })
  })
})
