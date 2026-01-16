import { Router, Response } from 'express';
import { hotelService } from '../services/hotel.service';
import { roomService } from '../services/room.service';
import { bookingService } from '../services/booking.service';
import { adminService } from '../services/admin.service';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validate.middleware';
import { createHotelSchema, updateHotelSchema } from '../schemas/hotel.schema';
import { createRoomSchema, updateRoomSchema } from '../schemas/room.schema';
import { bookingQuerySchema } from '../schemas/booking.schema';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// ==================== DASHBOARD ====================

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();
    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
});

// ==================== HOTELS ====================

// POST /api/admin/hotels
router.post('/hotels', validate(createHotelSchema), async (req, res, next) => {
  try {
    const hotel = await hotelService.create(req.body);
    res.status(201).json({
      success: true,
      data: hotel,
      message: 'Hotel created',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/hotels/:id
router.put('/hotels/:id', validate(updateHotelSchema), async (req, res, next) => {
  try {
    const hotel = await hotelService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: hotel,
      message: 'Hotel updated',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/hotels/:id
router.delete('/hotels/:id', async (req, res, next) => {
  try {
    await hotelService.delete(req.params.id);
    res.json({
      success: true,
      message: 'Hotel deleted',
    });
  } catch (error) {
    next(error);
  }
});

// ==================== ROOMS ====================

// POST /api/admin/hotels/:hotelId/rooms
router.post('/hotels/:hotelId/rooms', validate(createRoomSchema), async (req, res, next) => {
  try {
    const room = await roomService.create(req.params.hotelId, req.body);
    res.status(201).json({
      success: true,
      data: room,
      message: 'Room created',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/rooms/:roomId
router.put('/rooms/:roomId', validate(updateRoomSchema), async (req, res, next) => {
  try {
    const room = await roomService.update(req.params.roomId, req.body);
    res.json({
      success: true,
      data: room,
      message: 'Room updated',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/rooms/:roomId
router.delete('/rooms/:roomId', async (req, res, next) => {
  try {
    await roomService.delete(req.params.roomId);
    res.json({
      success: true,
      message: 'Room deleted',
    });
  } catch (error) {
    next(error);
  }
});

// ==================== BOOKINGS ====================

// GET /api/admin/bookings
router.get('/bookings', validateQuery(bookingQuerySchema), async (req, res, next) => {
  try {
    const result = await bookingService.findAll(req.query as any);
    res.json({
      success: true,
      data: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/bookings/:id/cancel
router.patch('/bookings/:id/cancel', async (req, res, next) => {
  try {
    const booking = await bookingService.adminCancel(req.params.id);
    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled',
    });
  } catch (error) {
    next(error);
  }
});

// ==================== USERS ====================

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await adminService.getUsers(page, limit);
    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/users/:id/suspend
router.patch('/users/:id/suspend', async (req, res, next) => {
  try {
    const user = await adminService.suspendUser(req.params.id);
    res.json({
      success: true,
      data: user,
      message: 'User suspended',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/users/:id/activate
router.patch('/users/:id/activate', async (req, res, next) => {
  try {
    const user = await adminService.activateUser(req.params.id);
    res.json({
      success: true,
      data: user,
      message: 'User activated',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
