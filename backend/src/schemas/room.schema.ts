import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(2).max(100),
  roomType: z.string().min(2).max(50),
  description: z.string().min(10),
  capacity: z.number().int().positive().max(20),
  pricePerNight: z.number().positive(),
  totalRooms: z.number().int().positive(),
  images: z.array(z.string().url()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
