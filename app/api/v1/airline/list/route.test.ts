import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';

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

    const response = await GET(req as NextRequest) ;

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const airlines = await response.json();
    expect(Array.isArray(airlines)).toBe(true);
    expect(airlines.length).toBeGreaterThan(0);

    expect(airlines).toContainEqual(
      expect.objectContaining({
        callsign: 'MILE-AIR',
        country: 'United States',
        iata: 'Q5',
        icao: 'MLA',
        id: 10,
        name: '40-Mile Air',
        type: 'airline'
      }),
    );

    expect(airlines).toContainEqual(
      expect.objectContaining({
        callsign: 'TXW',
        country: 'United States',
        iata: 'TQ',
        icao: 'TXW',
        id: 10123,
        name: 'Texas Wings',
        type: 'airline'
      }),
    );

    expect(airlines).toContainEqual(
      expect.objectContaining({
        callsign: 'atifly',
        country: 'United States',
        iata: 'A1',
        icao: 'A1F',
        id: 10226,
        name: 'Atifly',
        type: 'airline'
      }),
    );
    
  });

  it('should return an error response when failed to fetch airlines', async () => {
    const req = {} as NextRequest;

    const response = await GET(req);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const error = await response.json();
    expect(error.message).toBe('An error occurred while fetching airlines');
  });
});