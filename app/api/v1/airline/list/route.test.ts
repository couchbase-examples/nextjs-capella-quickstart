import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';
import { TAirline } from '@/app/models/Airline';

describe('GET function', () => {
  it('should return a list of airlines for a given country', async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          country: 'United States',
          limit: '10',
          offset: '0',
        }),
      },
    };

    const response = await GET(req as NextRequest);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const fetchedAirlines = await response.json();
    expect(Array.isArray(fetchedAirlines)).toBe(true);
    expect(fetchedAirlines.length).toBeGreaterThan(0);

    const expectedAirlines:TAirline[] = [
      {
        callsign: 'MILE-AIR',
        country: 'United States',
        iata: 'Q5',
        icao: 'MLA',
        name: '40-Mile Air',
      },
      {
        callsign: 'TXW',
        country: 'United States',
        iata: 'TQ',
        icao: 'TXW',
        name: 'Texas Wings',
      },
      {
        callsign: 'atifly',
        country: 'United States',
        iata: 'A1',
        icao: 'A1F',
        name: 'Atifly',
      }
    ]

    for (let i = 0; i < expectedAirlines.length; i++) {
      expect(fetchedAirlines[i].callsign).toBe(expectedAirlines[i].callsign);
      expect(fetchedAirlines[i].country).toBe(expectedAirlines[i].country);
      expect(fetchedAirlines[i].iata).toBe(expectedAirlines[i].iata);
      expect(fetchedAirlines[i].icao).toBe(expectedAirlines[i].icao);
      expect(fetchedAirlines[i].name).toBe(expectedAirlines[i].name);
  }
 
  });

  it("should return an empty list when there are no airlines for the given country", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          country: "CountryWithNoAirlines",
          limit: "10",
          offset: "0",
        }),
      },
    }

    const response = await GET(req as NextRequest)

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    const airlines = await response.json()
    expect(airlines).toEqual([])
  })

  it('should return an error response when failed to fetch airlines', async () => {
    const req = {} as NextRequest;

    const response = await GET(req);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const error = await response.json();
    expect(error.message).toBe('An error occurred while fetching airlines');
  });
});