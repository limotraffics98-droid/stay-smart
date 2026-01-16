import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateReviewInput, ReviewQueryInput } from '../schemas/review.schema';

export class ReviewService {
  async findByHotel(hotelId: string, query: ReviewQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { hotelId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { hotelId } }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(userId: string, hotelId: string, data: CreateReviewInput) {
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new AppError(404, 'Hotel not found', 'Not found');
    }

    // Check if user has stayed at this hotel
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        hotelId,
        status: 'completed',
      },
    });

    if (!hasBooking) {
      throw new AppError(403, 'You can only review hotels where you have completed a stay', 'Forbidden');
    }

    // Check if user already reviewed this hotel
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_hotelId: { userId, hotelId },
      },
    });

    if (existingReview) {
      throw new AppError(409, 'You have already reviewed this hotel', 'Conflict');
    }

    const review = await prisma.review.create({
      data: {
        userId,
        hotelId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    // Update hotel rating
    const reviews = await prisma.review.findMany({
      where: { hotelId },
      select: { rating: true },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: avgRating },
    });

    return review;
  }
}

export const reviewService = new ReviewService();
