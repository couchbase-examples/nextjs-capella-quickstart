import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { getDatabase } from "@/lib/couchbase-connection"
import { Airport } from "@/app/models/Airport"

import {
  DELETE as deleteHandler,
  GET as getHandler,
  POST as postHandler,
  PUT as putHandler,
} from "./route"

const insertAirport = async (id: string, airport: Airport) => {
  const { airportCollection } = await getDatabase()
  await airportCollection.insert(id, airport)
}

const cleanupAirport = async (id: string) => {
  const { airportCollection } = await getDatabase()
  await airportCollection.remove(id)
}

describe("GET /api/v1/airport/{id}", () => {
  it("GET: should return an airport for a given ID", async () => {
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
})

describe("POST /api/v1/airport/{id}", () => {
  const airportId = "airport_post"
  const newAirport: Airport = {
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

  it("POST: should create an airport and return it", async () => {
    const response = await postHandler(
      {
        json: async () => newAirport,
      } as NextRequest,
      { params: { airportId } }
    )

    expect(response.status).toBe(201)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const createdAirport = await response.json()
    expect(createdAirport.airportId).toBe(airportId)
    expect(createdAirport.airportData).toEqual(newAirport)
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

  const updatedAirport: Airport = {
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

  it("PUT: should update an airport and return it", async () => {
    const response = await putHandler(
      { json: async () => updatedAirport } as NextRequest,
      { params: { airportId: id } }
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const responseBody = await response.json()

    expect(responseBody.airportId).toBe(id)
    expect(responseBody.airportData).toEqual(updatedAirport)
  })

  // cleanup
  afterEach(async () => {
    await cleanupAirport(id)
  })
})

describe("DELETE /api/v1/airport/{id}", () => {
  beforeEach(async () => {
    await insertAirport("airport_delete", {
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
  })

  it("DELETE: should delete an airport", async () => {
    const id = "airport_delete"
    const response = await deleteHandler({} as NextRequest, {
      params: { airportId: id },
    })
    expect(response.status).toBe(202)
  })
})
