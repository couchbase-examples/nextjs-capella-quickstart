import { z } from 'zod';

const GeoSchema = z.object({
  alt: z.number(),
  lat: z.number(),
  lon: z.number(),
});

const AirportSchema = z.object({
  airportname: z.string(),
  city: z.string(),
  country: z.string(),
  faa: z.string(),
  icao: z.string(),
  tz: z.string(),
  geo: GeoSchema,
});

export { AirportSchema, GeoSchema};

export type TAirport = z.infer<typeof AirportSchema>;
export type TGeo = z.infer<typeof GeoSchema>;