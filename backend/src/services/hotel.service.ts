import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { HotelQueryInput, CreateHotelInput, UpdateHotelInput } from '../schemas/hotel.schema';

export class HotelService {
  async findAll(query: HotelQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.HotelWhereInput = {};

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.priceFrom = {};
      if (query.minPrice !== undefined) where.priceFrom.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.priceFrom.lte = query.maxPrice;
    }

    if (query.minRating !== undefined) {
      where.rating = { gte: query.minRating };
    }

    if (query.amenities) {
      const amenityNames = query.amenities.split(',');
      where.amenities = {
        some: {
          amenity: {
            name: { in: amenityNames },
          },
        },
      };
    }

    // Filter by guest capacity
    if (query.guests) {
      where.rooms = {
        some: {
          capacity: { gte: query.guests },
        },
      };
    }

    let orderBy: Prisma.HotelOrderByWithRelationInput = { createdAt: 'desc' };

    switch (query.sortBy) {
      case 'price_asc':
        orderBy = { priceFrom: 'asc' };
        break;
      case 'price_desc':
        orderBy = { priceFrom: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
        orderBy = { bookings: { _count: 'desc' } };
        break;
    }

    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          amenities: {
            include: { amenity: true },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.hotel.count({ where }),
    ]);

    return {
      hotels: hotels.map((h) => ({
        ...h,
        amenities: h.amenities.map((a) => a.amenity),
        reviewCount: h._count.reviews,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: {
          include: { amenity: true },
        },
        rooms: {
          include: {
            images: { orderBy: { order: 'asc' } },
          },
        },
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    });

    if (!hotel) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    return {
      ...hotel,
      amenities: hotel.amenities.map((a) => a.amenity),
      reviewCount: hotel._count.reviews,
    };
  }

  async checkAvailability(
    hotelId: string,
    checkIn: Date,
    checkOut: Date,
    roomId?: string,
    requestedRooms: number = 1
  ) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: {
          where: roomId ? { id: roomId } : undefined,
        },
      },
    });

    if (!hotel) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    const availability = await Promise.all(
      hotel.rooms.map(async (room) => {
        // Count overlapping bookings
        const bookedRooms = await prisma.booking.aggregate({
          where: {
            roomId: room.id,
            status: { in: ['confirmed', 'pending_payment'] },
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gt: checkIn } },
            ],
          },
          _sum: {
            roomsCount: true,
          },
        });

        const booked = bookedRooms._sum.roomsCount || 0;
        const available = room.totalRooms - booked;

        return {
          roomId: room.id,
          roomName: room.name,
          roomType: room.roomType,
          totalRooms: room.totalRooms,
          bookedRooms: booked,
          availableRooms: Math.max(0, available),
          isAvailable: available >= requestedRooms,
          pricePerNight: room.pricePerNight,
          capacity: room.capacity,
        };
      })
    );

    return {
      hotelId,
      checkIn,
      checkOut,
      rooms: availability,
    };
  }

  async create(data: CreateHotelInput) {
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        city: data.city,
        address: data.address,
        description: data.description,
        lat: data.lat,
        lng: data.lng,
        mainImage: data.mainImage,
        priceFrom: data.priceFrom,
        rating: 0,
        amenities: data.amenityIds
          ? {
              create: data.amenityIds.map((amenityId) => ({
                amenityId,
              })),
            }
          : undefined,
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
        amenities: { include: { amenity: true } },
        images: true,
      },
    });

    return hotel;
  }

  async update(id: string, data: UpdateHotelInput) {
    const existing = await prisma.hotel.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    // Handle amenities update
    if (data.amenityIds) {
      await prisma.hotelAmenity.deleteMany({ where: { hotelId: id } });
      await prisma.hotelAmenity.createMany({
        data: data.amenityIds.map((amenityId) => ({
          hotelId: id,
          amenityId,
        })),
      });
    }

    // Handle images update
    if (data.images) {
      await prisma.hotelImage.deleteMany({ where: { hotelId: id } });
      await prisma.hotelImage.createMany({
        data: data.images.map((imageUrl, index) => ({
          hotelId: id,
          imageUrl,
          order: index,
        })),
      });
    }

    const { amenityIds, images, ...updateData } = data;

    const hotel = await prisma.hotel.update({
      where: { id },
      data: updateData,
      include: {
        amenities: { include: { amenity: true } },
        images: true,
      },
    });

    return hotel;
  }

  async delete(id: string) {
    const existing = await prisma.hotel.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    await prisma.hotel.delete({ where: { id } });
  }

  async getAmenities() {
    return prisma.amenity.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

export const hotelService = new HotelService();
