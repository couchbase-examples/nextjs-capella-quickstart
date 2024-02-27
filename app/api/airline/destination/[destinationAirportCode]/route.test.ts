import { NextRequest } from "next/server"
import { afterAll, describe, expect, it } from "vitest"

import { getDatabase } from "../../../../../lib/couchbase-connection"
import { GET as getHandler } from "./route"

afterAll(async () => {
  const { cluster } = await getDatabase()
  await cluster.close()
})

describe("GET /api/airline/destination/{destinationAirportCode}", () => {
  it("should respond with status code 200 OK and return airlines as array", async () => {
    const response = await getHandler({} as NextRequest, {
      params: { destinationAirportCode: "LAX" },
    })
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody).toBeInstanceOf(Array)
  })
})
