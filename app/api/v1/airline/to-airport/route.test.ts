import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';
import { TAirline } from '@/app/models/Airline';

// The route's SQL++ query has no ORDER BY, so Couchbase makes no guarantee
// about row order: it follows whatever the query plan produces and shifts when
// indexes are rebuilt or when the route collection gains/loses documents.
// Compare on identity fields only, and without depending on position.
const identity = ({ callsign, country, iata, icao, name }: TAirline) => ({
    callsign,
    country,
    iata,
    icao,
    name,
});

describe('GET /api/v1/airline/to-airport', () => {

    it('GET: should return a list of airlines flying to a destination airport', async () => {
        // Without an ORDER BY the LIMIT window is an arbitrary slice, so a
        // limit large enough to cover every airline serving MRS is what makes
        // "these airlines are in the results" a stable assertion.
        const req = {
            nextUrl: {
                searchParams: new URLSearchParams({
                    destinationAirportCode: 'MRS',
                    limit: '100',
                    offset: '0',
                }),
            },
        };
        const expectedAirlines: TAirline[] =
            [
                {
                    callsign: 'AIRLINAIR',
                    country: 'France',
                    iata: 'A5',
                    icao: 'RLA',
                    name: 'Airlinair',
                },
                {
                    callsign: 'SPEEDBIRD', 
                    country: 'United Kingdom',
                    iata: 'BA',
                    icao: 'BAW',
                    name: 'British Airways',
                },
                {
                    callsign: 'AIRFRANS',
                    country: 'France', 
                    iata: 'AF',
                    icao: 'AFR',
                    name: 'Air France',
                },
                {
                    callsign: 'CORSICA',
                    country: 'France',
                    iata: 'XK',
                    icao: 'CCM',
                    name: 'Corse-Mediterranee',
                },
                {
                    callsign: 'EASY',
                    country: 'United Kingdom',
                    iata: 'U2',
                    icao: 'EZY',
                    name: 'easyJet',
                },
                {
                    callsign: 'AMERICAN',
                    country: 'United States',
                    iata: 'AA',
                    icao: 'AAL',
                    name: 'American Airlines',
                },
                {
                    callsign: 'TWINJET',
                    country: 'France',
                    iata: 'T7',
                    icao: 'TJT',
                    name: 'Twin Jet',
                },
                {
                    callsign: 'STARWAY',
                    country: 'France',
                    iata: 'SE',
                    icao: 'SEU',
                    name: 'XL Airways France',
                },
            ];


        const response = await GET(req as NextRequest);
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const fetchedAirlines: TAirline[] = await response.json();

        expect(fetchedAirlines.length).toBeGreaterThanOrEqual(expectedAirlines.length);
        expect(fetchedAirlines.map(identity)).toEqual(
            expect.arrayContaining(expectedAirlines.map(identity))
        );
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
