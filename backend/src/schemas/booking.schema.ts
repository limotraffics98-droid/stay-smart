import { z } from 'zod';

export const createBookingSchema = z.object({
  hotelId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid check-in date'),
  checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid check-out date'),
  guests: z.number().int().positive().max(20),
  roomsCount: z.number().int().positive().max(10),
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email().max(255),
  guestPhone: z.string().min(5).max(20),
  specialNotes: z.string().max(500).optional(),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'Check-out must be after check-in', path: ['checkOut'] }
).refine(
  (data) => new Date(data.checkIn) >= new Date(new Date().setHours(0, 0, 0, 0)),
  { message: 'Check-in cannot be in the past', path: ['checkIn'] }
);

export const bookingQuerySchema = z.object({
  status: z.enum(['pending_payment', 'confirmed', 'cancelled', 'completed']).optional(),
  page: z.string().transform(Number).pipe(z.number().positive()).optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().max(50)).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;
