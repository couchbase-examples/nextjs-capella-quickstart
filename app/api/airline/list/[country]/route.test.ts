import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';

describe('GET function', () => {
  it('should return a list of airlines for a given country', async () => {
    const req = {} as NextRequest;
    const params = { country: 'United States' };

    const response = await GET(req, { params });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const airlines = await response.json();
    expect(Array.isArray(airlines)).toBe(true);
    expect(airlines.length).toBeGreaterThan(0);
  });

  it('should return an error response when failed to fetch airlines', async () => {
    const req = {} as NextRequest;
    const params = { country: 'XYZ' };

    const response = await GET(req, { params });

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const error = await response.json();
    expect(error.message).toBe('An error occurred while fetching airlines');
  });
});