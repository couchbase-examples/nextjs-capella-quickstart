import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';

describe('GET /api/v1/airline/to-airport', () => {

    it('GET: should return a list of airlines flying to a destination airport', async () => {
        const req = {
            nextUrl: {
                searchParams: new URLSearchParams({
                    destinationAirportCode: 'MRS',
                    limit: '10',
                    offset: '0',
                }),
            },
        };
        const expectedAirlines =
            [{
                callsign: "AIRFRANS",
                country: 'France',
                iata: 'AF',
                icao: 'AFR',
                id: 137,
                name: 'Air France',
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
                callsign: 'AIRLINAIR',
                country: 'France',
                iata: 'A5',
                icao: 'RLA',
                id: 1203,
                name: 'Airlinair',
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
                callsign: 'TWINJET',
                country: 'France',
                iata: 'T7',
                icao: 'TJT',
                id: 4965,
                name: 'Twin Jet',
                type: 'airline'
            },
            {
                callsign: 'EASY',
                country: 'United Kingdom',
                iata: 'U2',
                icao: 'EZY',
                id: 2297,
                name: 'easyJet',
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
                callsign: 'CORSICA',
                country: 'France',
                iata: 'XK',
                icao: 'CCM',
                id: 1909,
                name: 'Corse-Mediterranee',
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
