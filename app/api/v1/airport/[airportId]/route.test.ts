import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { getDatabase } from "@/lib/couchbase-connection"
import { TAirport } from "@/app/models/Airport"

import {
  DELETE as deleteHandler,
  GET as getHandler,
  POST as postHandler,
  PUT as putHandler,
} from "./route"

import { DocumentNotFoundError, DocumentExistsError } from "couchbase"

const insertAirport = async (id: string, airport: TAirport) => {
  try {
    const { airportCollection } = await getDatabase()
    await airportCollection.insert(id, airport)
  } catch (error) {
    if (error instanceof DocumentExistsError) {
      console.warn(`Airport with id ${id} already exists during insertion.`)
    } else {
      console.warn(`Error occurred while inserting airport: ${error}`)
    }
  }
}

const cleanupAirport = async (id: string) => {
  try {
    const { airportCollection } = await getDatabase()
    await airportCollection.remove(id)
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      console.warn(`Airport with id ${id} does not exist during cleanup.`)
    } else {
      console.warn(`Error occurred while removing airport: ${error}`)
    }
  }
}

describe("GET /api/v1/airport/{id}", () => {
  it("it should respond with status code 200 OK and return airport as object", async () => {
    const airportId = "airport_1262"

    const expectedAirport = {
      id: 1262,
      type: "airport",
      airportname: "La Garenne",
      city: "Agen",
      country: "France",
      faa: "AGF",
      icao: "LFBA",
      tz: "Europe/Paris",
      geo: {
        lat: 44.174721,
        lon: 0.590556,
        alt: 204,
      },
    }

    const response = await getHandler({} as NextRequest, {
      params: { airportId: airportId },
    })

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const airport = await response.json()
    expect(airport).toEqual(expectedAirport)
  })

  it("it should respond with status code 404 Not Found", async () => {
    const airportId = "airport_404"

    const response = await getHandler({} as NextRequest, {
      params: { airportId: airportId },
    })

    expect(response.status).toBe(404)
  })
})

describe("POST /api/v1/airport/{id}", () => {
  const airportId = "airport_post"
  const newAirport: TAirport = {
    id: 999,
    type: "test-airport",
    airportname: "Test Airport",
    city: "Test City",
    country: "Test Country",
    faa: "",
    icao: "Test LFAG",
    tz: "Test Europe/Paris",
    geo: {
      lat: 49.868547,
      lon: 3.029578,
      alt: 295.0,
    },
  }

  it("it should respond with status code 201 Created and return airport as object", async () => {
    const response = await postHandler(
      {
        json: async () => newAirport,
      } as NextRequest,
      { params: { airportId } }
    )

    expect(response.status).toBe(201)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const createdAirport = await response.json()
    expect(createdAirport).toEqual(newAirport)
  })

  it("it should respond with status code 400 Bad Request when the request body is invalid", async () => {
    const invalidAoportData = { "invalid": "data" }
    const response = await postHandler(
      {
        json: async () => invalidAoportData,
      } as NextRequest,
      { params: { airportId: airportId } }
    )

    expect(response.status).toBe(400)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const responseBody = await response.json()
    expect(responseBody.message).toBe("Invalid request body")
  })

  it("it should respond with status code 409 Conflict", async () => {
    await insertAirport(airportId, newAirport)

    const response = await postHandler(
      {
        json: async () => newAirport,
      } as NextRequest,
      { params: { airportId: airportId } }
    )

    expect(response.status).toBe(409)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const responseBody = await response.json()
    expect(responseBody.message).toBe("Airport already exists")
  })


  // cleanup
  afterEach(async () => {
    await cleanupAirport(airportId)
  })
})

describe("PUT /api/v1/airport/{id}", () => {
  const id = "airport_put"

  beforeEach(async () => {
    await insertAirport(id, {
      id: 999,
      type: "test-airport",
      airportname: "Test Airport",
      city: "Test City",
      country: "Test Country",
      faa: "ABC",
      icao: "TEST",
      tz: "Test Europe/Paris",
      geo: {
        lat: 49.868547,
        lon: 3.029578,
        alt: 295.0,
      },
    })
  })

  const updatedAirport: TAirport = {
    id: 999,
    type: "test-airport",
    airportname: "Test Airport",
    city: "Test City",
    country: "Test Country",
    faa: "BCD",
    icao: "TEST",
    tz: "Test Europe/Paris",
    geo: {
      lat: 49.868547,
      lon: 3.029578,
      alt: 295.0,
    },
  }

  it("it should respond with status code 200 OK and return updated airport as object", async () => {
    const response = await putHandler(
      { json: async () => updatedAirport } as NextRequest,
      { params: { airportId: id } }
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const responseBody = await response.json()

    expect(responseBody.parsedAirportData).toEqual(updatedAirport)
  })

  it("it should respond with status code 400 Bad Request", async () => {
    const invalidAirportData = { "invalid": "data" }
    const response = await putHandler(
      { json: async () => invalidAirportData } as NextRequest,
      { params: { airportId: id } }
    )

    expect(response.status).toBe(400)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const responseBody = await response.json()
    expect(responseBody.message).toBe("Invalid request body")
  })

  // cleanup
  afterEach(async () => {
    await cleanupAirport(id)
  })
})

describe("DELETE /api/v1/airport/{id}", () => {
  insertAirport("airport_delete", {
    id: 999,
    type: "test-airport",
    airportname: "Test Airport",
    city: "Test City",
    country: "Test Country",
    faa: "",
    icao: "Test LFAG",
    tz: "Test Europe/Paris",
    geo: {
      lat: 49.868547,
      lon: 3.029578,
      alt: 295.0,
    },
  })

  it("it should respond with status code 202 Accepted", async () => {
    const id = "airport_delete"
    const response = await deleteHandler({} as NextRequest, {
      params: { airportId: id },
    })
    expect(response.status).toBe(202)
  })

  it("it should respond with status code 404 Not Found", async () => {
    const id = "airport_404"
    const response = await deleteHandler({} as NextRequest, {
      params: { airportId: id },
    })
    expect(response.status).toBe(404)
  });
})
