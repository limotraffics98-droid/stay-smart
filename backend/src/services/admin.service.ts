import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export class AdminService {
  async getDashboard() {
    const [
      totalHotels,
      totalRooms,
      totalUsers,
      totalBookings,
      revenueResult,
      recentBookings,
      bookingsByStatus,
    ] = await Promise.all([
      prisma.hotel.count(),
      prisma.room.count(),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { totalAmount: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          hotel: { select: { name: true } },
        },
      }),
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // Calculate occupancy rate
    const today = new Date();
    const totalRoomCount = await prisma.room.aggregate({
      _sum: { totalRooms: true },
    });

    const occupiedRooms = await prisma.booking.aggregate({
      where: {
        status: 'confirmed',
        checkIn: { lte: today },
        checkOut: { gt: today },
      },
      _sum: { roomsCount: true },
    });

    const totalRoomsAvailable = totalRoomCount._sum.totalRooms || 0;
    const currentlyOccupied = occupiedRooms._sum.roomsCount || 0;
    const occupancyRate = totalRoomsAvailable > 0
      ? (currentlyOccupied / totalRoomsAvailable) * 100
      : 0;

    return {
      stats: {
        totalHotels,
        totalRooms,
        totalUsers,
        totalBookings,
        totalRevenue: Number(revenueResult._sum.totalAmount || 0),
        occupancyRate: Math.round(occupancyRate * 100) / 100,
      },
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      recentBookings,
    };
  }

  async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          _count: {
            select: { bookings: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users: users.map((u) => ({
        ...u,
        bookingsCount: u._count.bookings,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async suspendUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, 'User not found', 'Not found');
    }

    if (user.role === 'admin') {
      throw new AppError(403, 'Cannot suspend admin users', 'Forbidden');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { status: 'suspended' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });
  }

  async activateUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, 'User not found', 'Not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { status: 'active' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });
  }
}

export const adminService = new AdminService();
