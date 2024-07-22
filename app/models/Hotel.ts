// app/models/Hotel.ts
import { z } from 'zod';

const HotelSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export { HotelSchema };
export type THotel = z.infer<typeof HotelSchema>;
