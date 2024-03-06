import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';

describe('GET function', () => {
  it('should return a list of direct connections for a given airport', async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          destinationAirportCode: 'JFK',
          limit: '10',
          offset: '0',
        }),
      },
    };

    const response = await GET(req as NextRequest);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const connections = await response.json();
    expect(Array.isArray(connections)).toBe(true);
    expect(connections.length).toBeGreaterThan(0);


    connections.forEach((connection: any) => {
      expect(typeof connection).toBe('string');
    });

    expect(connections).toEqual(
      expect.arrayContaining([
        'DEL', 'LHR', 'EZE',
        'ATL', 'CUN', 'MEX',
        'LAX', 'SAN', 'SEA',
        'SFO'
      ])
    );

  });

  it("should return an error response when destinationAirportCode is not provided", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          limit: "10",
          offset: "0",
        }),
      },
    }

    const response = await GET(req as NextRequest)

    expect(response.status).toBe(400)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const error = await response.json()
    expect(error.message).toBe("Destination airport code is required")
  })

  it("should return an empty list when there are no direct connections", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          destinationAirportCode: "XYZ",
          limit: "10",
          offset: "0",
        }),
      },
    }

    const response = await GET(req as NextRequest)

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const connections = await response.json()
    expect(connections).toEqual([])
  })

  it('should return an error response when failed to fetch connections', async () => {
    const req = {} as NextRequest;

    const response = await GET(req);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const error = await response.json();
    expect(error.message).toBe('An error occurred while fetching connections');
  });
});
