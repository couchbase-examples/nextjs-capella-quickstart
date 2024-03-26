import { z } from 'zod';


const ScheduleSchema = z.object({
  day: z.number(),
  flight: z.string(),
  utc: z.string(),
});

const RouteSchema = z.object({
  id: z.number().optional(),
  type: z.string().optional(),
  airline: z.string(),
  airlineid: z.string(),
  sourceairport: z.string(),
  destinationairport: z.string(),
  stops: z.number(),
  equipment: z.string(),
  schedule: z.array(ScheduleSchema),
  distance: z.number(),
});

export { RouteSchema, ScheduleSchema};

export type TRoute = z.infer<typeof RouteSchema>;
export type TSchedule = z.infer<typeof ScheduleSchema>;