import prisma from '../lib/prisma';
import { Prisma, BookingStatus, PaymentStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { CreateBookingInput, BookingQueryInput } from '../schemas/booking.schema';
import { hotelService } from './hotel.service';

export class BookingService {
  async create(userId: string, data: CreateBookingInput) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // Verify hotel and room exist
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
      include: { hotel: true },
    });

    if (!room) {
      throw new AppError(404, 'Room not found', 'Not found');
    }

    if (room.hotelId !== data.hotelId) {
      throw new AppError(400, 'Room does not belong to this hotel', 'Bad request');
    }

    // Check guest capacity
    if (data.guests > room.capacity * data.roomsCount) {
      throw new AppError(400, `Room capacity exceeded. Max ${room.capacity * data.roomsCount} guests for ${data.roomsCount} room(s)`, 'Bad request');
    }

    // Calculate nights
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      throw new AppError(400, 'Minimum stay is 1 night', 'Bad request');
    }

    // Calculate total amount
    const roomTotal = Number(room.pricePerNight) * nights * data.roomsCount;
    const taxRate = 0.12; // 12% tax
    const serviceFee = 25;
    const taxes = roomTotal * taxRate;
    const totalAmount = roomTotal + taxes + serviceFee;

    // Use transaction with row locking to prevent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      // Lock rows and check availability
      const bookedRooms = await tx.$queryRaw<[{ count: bigint }]>`
        SELECT COALESCE(SUM(rooms_count), 0) as count
        FROM bookings
        WHERE room_id = ${data.roomId}
        AND status IN ('confirmed', 'pending_payment')
        AND check_in < ${checkOut}
        AND check_out > ${checkIn}
        FOR UPDATE
      `;

      const booked = Number(bookedRooms[0].count);
      const available = room.totalRooms - booked;

      if (available < data.roomsCount) {
        throw new AppError(
          409,
          `Only ${available} room(s) available for the selected dates`,
          'Conflict'
        );
      }

      // Create booking
      return tx.booking.create({
        data: {
          userId,
          hotelId: data.hotelId,
          roomId: data.roomId,
          checkIn,
          checkOut,
          guests: data.guests,
          roomsCount: data.roomsCount,
          totalAmount,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          specialNotes: data.specialNotes,
          status: BookingStatus.pending_payment,
          paymentStatus: PaymentStatus.pending,
        },
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
              city: true,
              address: true,
              mainImage: true,
            },
          },
          room: {
            select: {
              id: true,
              name: true,
              roomType: true,
              pricePerNight: true,
            },
          },
        },
      });
    });

    return {
      ...booking,
      priceBreakdown: {
        roomRate: Number(room.pricePerNight),
        nights,
        roomsCount: data.roomsCount,
        subtotal: roomTotal,
        taxes,
        serviceFee,
        total: totalAmount,
      },
    };
  }

  async findUserBookings(userId: string, query: BookingQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = { userId };

    if (query.status) {
      where.status = query.status as BookingStatus;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
              city: true,
              mainImage: true,
            },
          },
          room: {
            select: {
              id: true,
              name: true,
              roomType: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, userId?: string) {
    const where: Prisma.BookingWhereInput = { id };

    // If userId provided, ensure user can only access their own bookings
    if (userId) {
      where.userId = userId;
    }

    const booking = await prisma.booking.findFirst({
      where,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
            mainImage: true,
            lat: true,
            lng: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
            pricePerNight: true,
            capacity: true,
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      throw new AppError(404, 'Booking not found', 'Not found');
    }

    return booking;
  }

  async cancel(id: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      throw new AppError(404, 'Booking not found', 'Not found');
    }

    if (booking.status === 'cancelled') {
      throw new AppError(400, 'Booking is already cancelled', 'Bad request');
    }

    if (booking.status === 'completed') {
      throw new AppError(400, 'Cannot cancel a completed booking', 'Bad request');
    }

    // Check cancellation policy (24 hours before check-in)
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      throw new AppError(400, 'Cannot cancel within 24 hours of check-in', 'Bad request');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.cancelled,
      },
      include: {
        hotel: {
          select: { name: true },
        },
        room: {
          select: { name: true },
        },
      },
    });

    // Handle refund if payment was made
    if (booking.paymentStatus === 'paid') {
      await prisma.payment.updateMany({
        where: { bookingId: id },
        data: { status: PaymentStatus.refunded },
      });

      await prisma.booking.update({
        where: { id },
        data: { paymentStatus: PaymentStatus.refunded },
      });
    }

    return updatedBooking;
  }

  async confirmPayment(id: string, paymentRef: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new AppError(404, 'Booking not found', 'Not found');
    }

    if (booking.status !== 'pending_payment') {
      throw new AppError(400, 'Booking is not pending payment', 'Bad request');
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: {
          status: BookingStatus.confirmed,
          paymentStatus: PaymentStatus.paid,
        },
      }),
      prisma.payment.create({
        data: {
          bookingId: id,
          provider: 'stripe',
          providerRef: paymentRef,
          amount: booking.totalAmount,
          currency: 'USD',
          status: PaymentStatus.paid,
        },
      }),
    ]);

    return this.findById(id);
  }

  // Admin methods
  async findAll(query: BookingQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (query.status) {
      where.status = query.status as BookingStatus;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
          hotel: {
            select: { name: true, city: true },
          },
          room: {
            select: { name: true, roomType: true },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminCancel(id: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new AppError(404, 'Booking not found', 'Not found');
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.cancelled,
        paymentStatus: booking.paymentStatus === 'paid' ? PaymentStatus.refunded : booking.paymentStatus,
      },
    });
  }
}

export const bookingService = new BookingService();
