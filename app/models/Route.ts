import { z } from 'zod';


const ScheduleSchema = z.object({
  day: z.number(),
  flight: z.string(),
  utc: z.string(),
});

const RouteSchema = z.object({
  id: z.number(),
  type: z.string(),
  airline: z.string().optional(),
  airlineid: z.string().optional(),
  sourceairport: z.string().optional(),
  destinationairport: z.string().optional(),
  stops: z.number().optional(),
  equipment: z.string().optional(),
  schedule: z.array(ScheduleSchema).optional(),
  distance: z.number().optional(),
});

export { RouteSchema, ScheduleSchema};

export type TRoute = z.infer<typeof RouteSchema>;
export type TSchedule = z.infer<typeof ScheduleSchema>;