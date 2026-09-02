import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';
import { TAirline } from '@/app/models/Airline';

// The route's SQL++ query has no ORDER BY, so Couchbase makes no guarantee
// about row order: it follows whatever the query plan produces and shifts when
// indexes are rebuilt or when the airline collection gains/loses documents.
// Compare on identity fields only, and without depending on position.
const identity = ({ callsign, country, iata, icao, name }: TAirline) => ({
  callsign,
  country,
  iata,
  icao,
  name,
});

describe('GET function', () => {
  it('should return a list of airlines for a given country', async () => {
    // Without an ORDER BY the LIMIT window is an arbitrary slice, so a limit
    // large enough to cover every airline in the sample data is what makes
    // "these airlines are in the results" a stable assertion.
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          country: 'United States',
          limit: '200',
          offset: '0',
        }),
      },
    };

    const response = await GET(req as NextRequest);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const fetchedAirlines: TAirline[] = await response.json();
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

    expect(fetchedAirlines.map(identity)).toEqual(
      expect.arrayContaining(expectedAirlines.map(identity))
    );

    fetchedAirlines.forEach((airline) => {
      expect(airline.country).toBe('United States');
    });
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