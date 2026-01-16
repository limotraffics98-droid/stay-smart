import { z } from 'zod';

export const hotelQuerySchema = z.object({
  city: z.string().optional(),
  minPrice: z.string().transform(Number).pipe(z.number().nonnegative()).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().positive()).optional(),
  minRating: z.string().transform(Number).pipe(z.number().min(0).max(5)).optional(),
  amenities: z.string().optional(), // comma-separated
  guests: z.string().transform(Number).pipe(z.number().positive()).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'popular']).optional(),
  page: z.string().transform(Number).pipe(z.number().positive()).optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().max(50)).optional(),
});

export const availabilityQuerySchema = z.object({
  checkIn: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  checkOut: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  roomId: z.string().uuid().optional(),
  rooms: z.string().transform(Number).pipe(z.number().positive()).optional(),
});

export const createHotelSchema = z.object({
  name: z.string().min(2).max(200),
  city: z.string().min(2).max(100),
  address: z.string().min(5).max(500),
  description: z.string().min(10),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  mainImage: z.string().url().max(500),
  priceFrom: z.number().positive(),
  amenityIds: z.array(z.string().uuid()).optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateHotelSchema = createHotelSchema.partial();

export type HotelQueryInput = z.infer<typeof hotelQuerySchema>;
export type AvailabilityQueryInput = z.infer<typeof availabilityQuerySchema>;
export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
