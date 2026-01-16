import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateRoomInput, UpdateRoomInput } from '../schemas/room.schema';

export class RoomService {
  async findByHotel(hotelId: string) {
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    const rooms = await prisma.room.findMany({
      where: { hotelId },
      include: {
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { pricePerNight: 'asc' },
    });

    return rooms;
  }

  async findById(roomId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        images: { orderBy: { order: 'asc' } },
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    if (!room) {
      throw new AppError(404, 'Room not found', 'Not found');
    }

    return room;
  }

  async create(hotelId: string, data: CreateRoomInput) {
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    const room = await prisma.room.create({
      data: {
        hotelId,
        name: data.name,
        roomType: data.roomType,
        description: data.description,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight,
        totalRooms: data.totalRooms,
        images: data.images
          ? {
              create: data.images.map((imageUrl, index) => ({
                imageUrl,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    // Update hotel priceFrom if this room is cheaper
    if (data.pricePerNight < Number(hotel.priceFrom)) {
      await prisma.hotel.update({
        where: { id: hotelId },
        data: { priceFrom: data.pricePerNight },
      });
    }

    return room;
  }

  async update(roomId: string, data: UpdateRoomInput) {
    const existing = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!existing) {
      throw new AppError(404, 'Room not found', 'Not found');
    }

    // Handle images update
    if (data.images) {
      await prisma.roomImage.deleteMany({ where: { roomId } });
      await prisma.roomImage.createMany({
        data: data.images.map((imageUrl, index) => ({
          roomId,
          imageUrl,
          order: index,
        })),
      });
    }

    const { images, ...updateData } = data;

    const room = await prisma.room.update({
      where: { id: roomId },
      data: updateData,
      include: { images: true },
    });

    // Update hotel priceFrom if needed
    if (data.pricePerNight) {
      const minRoom = await prisma.room.findFirst({
        where: { hotelId: existing.hotelId },
        orderBy: { pricePerNight: 'asc' },
      });

      if (minRoom) {
        await prisma.hotel.update({
          where: { id: existing.hotelId },
          data: { priceFrom: minRoom.pricePerNight },
        });
      }
    }

    return room;
  }

  async delete(roomId: string) {
    const existing = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!existing) {
      throw new AppError(404, 'Room not found', 'Not found');
    }

    await prisma.room.delete({ where: { id: roomId } });

    // Update hotel priceFrom
    const minRoom = await prisma.room.findFirst({
      where: { hotelId: existing.hotelId },
      orderBy: { pricePerNight: 'asc' },
    });

    if (minRoom) {
      await prisma.hotel.update({
        where: { id: existing.hotelId },
        data: { priceFrom: minRoom.pricePerNight },
      });
    }
  }
}

export const roomService = new RoomService();
