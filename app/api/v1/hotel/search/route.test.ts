import { THotel } from '@/app/models/Hotel';
import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET as getHandler } from "./route";

describe('GET /api/v1/hotel/search', () => {
  it('should return a list of hotels matching the name', async () => {

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          name: 'Omni',
          limit: '10',
          offset: '0',
        }),
      },
    };

    const response = await getHandler(req as NextRequest);
    const hotels = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(hotels).toEqual(expect.any(Array));
    expect(hotels.length).toBeGreaterThan(0);

    hotels.forEach((hotel: THotel) => {
      expect(hotel).toHaveProperty('name');
      expect(hotel).toHaveProperty('title');
      expect(hotel).toHaveProperty('description');
      expect(hotel).toHaveProperty('country');
      expect(hotel).toHaveProperty('city');
      expect(hotel).toHaveProperty('state');
    });
  });

  it('should respond with status code 400 error if name parameter is missing', async () => {

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          limit: '10',
          offset: '0',
        }),
      },
    };

    const response = await getHandler(req as NextRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: 'name query parameter is required' });
  });

  it('should return an empty array if no hotels match the search term', async () => {

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          name: 'NonExistentHotel',
          limit: '10',
          offset: '0',
        }),
      },
    };

    const response = await getHandler(req as NextRequest);
    const hotels = await response.json();

    expect(response.status).toBe(200);
    expect(hotels).toEqual([]);
  });
});