import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';

describe('GET /api/v1/airline/to-airport', () => {

    it('GET: should return a list of airlines flying to a destination airport', async () => {
        const req = {
            nextUrl: {
                searchParams: new URLSearchParams({
                    destinationAirportCode: 'JFK',
                    limit: '10',
                    offset: '0',
                }),
            },
        };
        const expectedAirlines =
            [
                {
                    callsign: 'JETBLUE',
                    country: 'United States',
                    iata: 'B6',
                    icao: 'JBU',
                    id: 3029,
                    name: 'JetBlue Airways',
                    type: 'airline'
                },
                {
                    callsign: 'SPEEDBIRD',
                    country: 'United Kingdom',
                    iata: 'BA',
                    icao: 'BAW',
                    id: 1355,
                    name: 'British Airways',
                    type: 'airline'
                },
                {
                    callsign: 'DELTA',
                    country: 'United States',
                    iata: 'DL',
                    icao: 'DAL',
                    id: 2009,
                    name: 'Delta Air Lines',
                    type: 'airline'
                },
                {
                    callsign: 'HAWAIIAN',
                    country: 'United States',
                    iata: 'HA',
                    icao: 'HAL',
                    id: 2688,
                    name: 'Hawaiian Airlines',
                    type: 'airline'
                },
                {
                    callsign: 'FLAGSHIP',
                    country: 'United States',
                    iata: '9E',
                    icao: 'FLG',
                    id: 3976,
                    name: 'Pinnacle Airlines',
                    type: 'airline'
                },
                {
                    callsign: 'AMERICAN',
                    country: 'United States',
                    iata: 'AA',
                    icao: 'AAL',
                    id: 24,
                    name: 'American Airlines',
                    type: 'airline'
                },
                {
                    callsign: 'STARWAY',
                    country: 'France',
                    iata: 'SE',
                    icao: 'SEU',
                    id: 5479,
                    name: 'XL Airways France',
                    type: 'airline'
                },
                {
                    callsign: 'SUN COUNTRY',
                    country: 'United States',
                    iata: 'SY',
                    icao: 'SCX',
                    id: 4356,
                    name: 'Sun Country Airlines',
                    type: 'airline'
                },
                {
                    callsign: 'UNITED',
                    country: 'United States',
                    iata: 'UA',
                    icao: 'UAL',
                    id: 5209,
                    name: 'United Airlines',
                    type: 'airline'
                },
                {
                    callsign: 'U S AIR',
                    country: 'United States',
                    iata: 'US',
                    icao: 'USA',
                    id: 5265,
                    name: 'US Airways',
                    type: 'airline'
                }
            ];

        const response = await GET(req as NextRequest);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const fetchedAirlines = await response.json();
        expect(fetchedAirlines).toEqual(expectedAirlines);
    });

    it('GET: should return a 400 error when destinationAirportCode is not provided', async () => {
        const response = await GET({ nextUrl: { searchParams: new URLSearchParams({ limit: '10', offset: '0' }) } } as NextRequest);

        expect(response.status).toBe(400);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const error = await response.json();
        expect(error).toEqual({ message: "Destination airport code is required" });
    });

    it('GET: should return a 500 error when an error occurs while fetching airlines', async () => {
        const response = await GET({} as NextRequest);

        expect(response.status).toBe(500);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const error = await response.json();
        expect(error).toEqual({ message: "Failed to fetch airlines" });
    });

}

)
