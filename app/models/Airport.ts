import { z } from 'zod';

const GeoSchema = z.object({
  alt: z.number(),
  lat: z.number(),
  lon: z.number(),
});

const AirportSchema = z.object({
  id: z.number(),
  type: z.string(),
  airportname: z.string().optional(),
  city: z.string(),
  country: z.string(),
  faa: z.string(),
  icao: z.string().optional(),
  tz: z.string().optional(),
  geo: GeoSchema.optional(),
});

export { AirportSchema, GeoSchema};

export type TAirport = z.infer<typeof AirportSchema>;
export type TGeo = z.infer<typeof GeoSchema>;