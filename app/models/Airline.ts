import { z } from 'zod';

const AirlineSchema = z.object({
  id: z.number().optional(),
  type: z.string().optional(),
  callsign: z.string(),
  country: z.string(),
  iata: z.string(),
  icao: z.string(),
  name: z.string(),
});

export { AirlineSchema };

export type TAirline = z.infer<typeof AirlineSchema>;