import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DELETE as deleteHandler,
  GET as getHandler,
  POST as postHandler,
  PUT as putHandler,
} from "./route"
import { Airport } from '@/app/models/AirportModel';
import { getDatabase } from '@/lib/couchbase-connection';

const insertAirport = async (id: string, airport: Airport) => {
  const { airportCollection } = await getDatabase()
  await airportCollection.insert(id, airport)
}

const cleanupAirport = async (id: string) => {
  const { airportCollection } = await getDatabase()
  await airportCollection.remove(id)
}


describe('GET /api/v1/airport/{id}', () => {

  it('GET: should return an airport for a given ID', async () => {
    const airportId = 'airport_1254';
    const expectedAirport = {
      id: 1254,
      type: "airport",
      airportname: "Calais Dunkerque",
      city: "Calais",
      country: "France",
      faa: "CQF",
      icao: "LFAC",
      tz: "Europe/Paris",
      geo: {
        lat: 50.962097,
        lon: 1.954764,
        alt: 12,
      }
    };


    const response = await getHandler({} as NextRequest, { params: { airportId: airportId } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const airport = await response.json();
    expect(airport).toEqual(expectedAirport);
  });

});

describe('POST /api/v1/airport/{id}', () => {

  it('POST: should create an airport and return it', async () => {
    const airportId = 'airport_post';
    const airportData = {
      id: 999,
      type: "test-airport",
      airportname: "Test Airport",
      city: "Test City",
      country: "Test Country",
      faa: "",
      icao: "Test LFAG",
      tz: "Test Europe/Paris",
      geo: {
        lat: 49.868547,
        lon: 3.029578,
        alt: 295.0
      }
    };

    const response = await postHandler({
      json: async () => airportData,
    } as NextRequest, { params: { airportId } });

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const createdAirport = await response.json();
    expect(createdAirport.airportId).toBe(airportId);
    expect(createdAirport.airportData).toEqual(airportData);

    // cleanup
    afterEach(async () => {
      const { airportCollection } = await getDatabase();
      await airportCollection.remove(airportId);
    });
  });

});

describe('PUT /api/v1/airport/{id}', () => {

  beforeEach(async () => {
    await insertAirport('airport_put', {
      id: 999,
      type: "test-airport",
      airportname: "Test Airport",
      city: "Test City",
      country: "Test Country",
      faa: "",
      icao: "Test LFAG",
      tz: "Test Europe/Paris",
      geo: {
        lat: 49.868547,
        lon: 3.029578,
        alt: 295.0
      }
    });
  });

  it('PUT: should update an airport and return it', async () => {
    const id = 'airport_put';
    const updatedAirportData = {
      id: 999,
      type: "test-airport",
      airportname: "Test Airport",
      city: "Test City",
      country: "Test Country",
      faa: "",
      icao: "Test LFAG",
      tz: "Test Europe/Paris",
      geo: {
        lat: 49.868547,
        lon: 3.029578,
        alt: 295.0
      }
    };

    const response = await putHandler(
      { json: async () => updatedAirportData } as NextRequest,
      { params: { airportId: id } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const updatedAirport = await response.json();
    expect(updatedAirport.airportId).toBe(id);
    expect(updatedAirport.airportData).toEqual(updatedAirportData);
  });

});

describe('DELETE /api/v1/airport/{id}', () => {

  beforeEach(async () => {
    await insertAirport('airport_delete', {
      id: 999,
      type: "test-airport",
      airportname: "Test Airport",
      city: "Test City",
      country: "Test Country",
      faa: "",
      icao: "Test LFAG",
      tz: "Test Europe/Paris",
      geo: {
        lat: 49.868547,
        lon: 3.029578,
        alt: 295.0
      }
    });
  });

  it('DELETE: should delete an airport', async () => {
    const id = 'airport_delete';
    const response = await deleteHandler({} as NextRequest, { params: { airportId: id } });
    expect(response.status).toBe(204);
  });

});