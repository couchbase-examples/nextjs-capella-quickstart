import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';


describe('GET function', () => {
  it('should return a list of airlines', async () => {
   
    const params = { destinationAirportCode: 'LAX' };

    const response = await GET( {} as NextRequest, { params });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const airlines = await response.json();
    expect(Array.isArray(airlines)).toBe(true);
    expect(airlines.length).toBeGreaterThan(0);
  });

  it('should return an error response when failed to fetch airlines', async () => {
  
    const params = { destinationAirportCode: 'XYZ' };

    const response = await GET({} as NextRequest, { params });

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const error = await response.json();
    expect(error.message).toBe('Failed to fetch airlines');
  });
});