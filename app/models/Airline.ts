import { z } from 'zod';

const AirlineSchema = z.object({
  callsign: z.string().optional(),
  country: z.string(),
  iata: z.string().optional(),
  icao: z.string(),
  id: z.number(),
  name: z.string(),
  type: z.string(),
});

export { AirlineSchema };

export type TAirline = z.infer<typeof AirlineSchema>;