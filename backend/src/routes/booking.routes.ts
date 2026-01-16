import { Router, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validate.middleware';
import { createBookingSchema, bookingQuerySchema } from '../schemas/booking.schema';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// POST /api/bookings
router.post('/', validate(createBookingSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const booking = await bookingService.create(req.user!.userId, req.body);
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/my
router.get('/my', validateQuery(bookingQuerySchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const result = await bookingService.findUserBookings(req.user!.userId, req.query as any);
    res.json({
      success: true,
      data: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/:id
router.get('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const booking = await bookingService.findById(req.params.id, req.user!.userId);
    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', async (req: AuthRequest, res: Response, next) => {
  try {
    const booking = await bookingService.cancel(req.params.id, req.user!.userId);
    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/bookings/:id/confirm-payment (for completing payment)
router.post('/:id/confirm-payment', async (req: AuthRequest, res: Response, next) => {
  try {
    const { paymentRef } = req.body;
    const booking = await bookingService.confirmPayment(req.params.id, paymentRef);
    res.json({
      success: true,
      data: booking,
      message: 'Payment confirmed',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
