import { THotel } from '@/app/models/Hotel';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { GET as getHandler } from './route';

describe('GET /api/v1/hotel/filter', () => {
  it('should return a list of hotels matching the filter criteria', async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          name: 'Holiday Inn',
          country: 'United States',
          city: 'Buena Park',
          state: 'California',
          limit: '10',
          offset: '0',
        }),
      },
    } ;

    const response = await getHandler(req as NextRequest);
    const hotels = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(hotels).toEqual(expect.any(Array));
    expect(hotels.length).toBeGreaterThan(0);

    hotels.forEach((hotel: THotel) => {
      expect(hotel).toHaveProperty('id');
      expect(hotel).toHaveProperty('name');
      expect(hotel).toHaveProperty('title');
      expect(hotel).toHaveProperty('description');
      expect(hotel).toHaveProperty('country');
      expect(hotel).toHaveProperty('city');
      expect(hotel).toHaveProperty('state');
    });
  });

  it('should return a list of hotels matching multiple filter criteria', async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          limit: '10',
          offset: '0',
        }),
      },
    } ;

    const response = await getHandler(req as NextRequest);
    const hotels = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(hotels).toEqual(expect.any(Array));
    expect(hotels.length).toBeGreaterThan(0);

    hotels.forEach((hotel: THotel) => {
      expect(hotel.country).toBe('United States');
      expect(hotel.state).toBe('California');
      expect(hotel.city).toBe('San Francisco');
    });
  });

  it('should return an empty array if no filters are provided', async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          limit: '10',
          offset: '0',
        }),
      },
    } ;

    const response = await getHandler(req as NextRequest);
    const hotels = await response.json();

    expect(response.status).toBe(200);
    expect(hotels).toEqual([]);
  });

  it('should return an empty array if no hotels match the filter criteria', async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          name: 'NonExistentHotel',
          country: 'United States',
          city: 'NonExistentCity',
          state: 'California',
          limit: '10',
          offset: '0',
        }),
      },
    } ;

    const response = await getHandler(req as NextRequest);
    const hotels = await response.json();

    expect(response.status).toBe(200);
    expect(hotels).toEqual([]);
  });
});
