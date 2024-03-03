import { NextRequest } from "next/server"
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest"

import { Route } from "@/app/models/RouteModel"

import { getDatabase } from "@/lib/couchbase-connection"
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
    const id = "route_10000"
    const expectedRoute: Route = {
        id: 10000,
        type: "route",
        airline: "AF",
        airlineid: "airline_137",
        sourceairport: "TLV",
        destinationairport: "MRS",
        stops: 0,
        equipment: "320",
        schedule: [{
            "day": 0,
            "utc": "10:13:00",
            "flight": "AF198"
        }, {
            "day": 0,
            "utc": "19:14:00",
            "flight": "AF547"
        }, {
            "day": 0,
            "utc": "01:31:00",
            "flight": "AF943"
        }, {
            "day": 1,
            "utc": "12:40:00",
            "flight": "AF356"
        }, {
            "day": 1,
            "utc": "08:58:00",
            "flight": "AF480"
        }, {
            "day": 1,
            "utc": "12:59:00",
            "flight": "AF250"
        }, {
            "day": 1,
            "utc": "04:45:00",
            "flight": "AF130"
        }, {
            "day": 2,
            "utc": "00:31:00",
            "flight": "AF997"
        }, {
            "day": 2,
            "utc": "19:41:00",
            "flight": "AF223"
        }, {
            "day": 2,
            "utc": "15:14:00",
            "flight": "AF890"
        }, {
            "day": 2,
            "utc": "00:30:00",
            "flight": "AF399"
        }, {
            "day": 2,
            "utc": "16:18:00",
            "flight": "AF328"
        }, {
            "day": 3,
            "utc": "23:50:00",
            "flight": "AF074"
        }, {
            "day": 3,
            "utc": "11:33:00",
            "flight": "AF556"
        }, {
            "day": 4,
            "utc": "13:23:00",
            "flight": "AF064"
        }, {
            "day": 4,
            "utc": "12:09:00",
            "flight": "AF596"
        }, {
            "day": 4,
            "utc": "08:02:00",
            "flight": "AF818"
        }, {
            "day": 5,
            "utc": "11:33:00",
            "flight": "AF967"
        }, {
            "day": 5,
            "utc": "19:42:00",
            "flight": "AF730"
        }, {
            "day": 6,
            "utc": "17:07:00",
            "flight": "AF882"
        }, {
            "day": 6,
            "utc": "17:03:00",
            "flight": "AF485"
        }, {
            "day": 6,
            "utc": "10:01:00",
            "flight": "AF898"
        }, {
            "day": 6,
            "utc": "07:00:00",
            "flight": "AF496"
        }],
        distance: 2881.617376098415,
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
            { params: { routeId: id } });

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');

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

    it("should respond with status code 204 No Content", async () => {
        const response = await deleteHandler({} as NextRequest, {
            params: { routeId: id },
        })

        expect(response.status).toBe(204)
    })
})
