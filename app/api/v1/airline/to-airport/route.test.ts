import { NextRequest } from 'next/server';
import { describe, expect, it } from "vitest";
import { GET } from './route';
import { TAirline } from '@/app/models/Airline';

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
        const expectedAirlines: TAirline[] =
            [
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
                    callsign: 'DELTA',
                    country: 'United States',
                    iata: 'DL',
                    icao: 'DAL',
                    name: 'Delta Air Lines',
                },
                {
                    callsign: 'AMERICAN',
                    country: 'United States',
                    iata: 'AA',
                    icao: 'AAL',
                    name: 'American Airlines',
                },
                {
                    callsign: 'HAWAIIAN',
                    country: 'United States',
                    iata: 'HA',
                    icao: 'HAL',
                    name: 'Hawaiian Airlines',
                },
                {
                    callsign: 'JETBLUE',
                    country: 'United States',
                    iata: 'B6',
                    icao: 'JBU',
                    name: 'JetBlue Airways',
                },
                {
                    callsign: 'FLAGSHIP',
                    country: 'United States',
                    iata: '9E',
                    icao: 'FLG',
                    name: 'Pinnacle Airlines',
                },
                {
                    callsign: 'SUN COUNTRY',
                    country: 'United States',
                    iata: 'SY',
                    icao: 'SCX',
                    name: 'Sun Country Airlines',
                },
                {
                    callsign: 'UNITED',
                    country: 'United States',
                    iata: 'UA',
                    icao: 'UAL',
                    name: 'United Airlines',
                },
                {
                    callsign: 'U S AIR',
                    country: 'United States',
                    iata: 'US',
                    icao: 'USA',
                    name: 'US Airways',
                },
            ];


        const response = await GET(req as NextRequest);
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const fetchedAirlines = await response.json();

        for (let i = 0; i < expectedAirlines.length; i++) {
            expect(fetchedAirlines[i].callsign).toBe(expectedAirlines[i].callsign);
            expect(fetchedAirlines[i].country).toBe(expectedAirlines[i].country);
            expect(fetchedAirlines[i].iata).toBe(expectedAirlines[i].iata);
            expect(fetchedAirlines[i].icao).toBe(expectedAirlines[i].icao);
            expect(fetchedAirlines[i].name).toBe(expectedAirlines[i].name);
        }
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
