import { Router } from 'express';
import { hotelService } from '../services/hotel.service';
import { validateQuery } from '../middleware/validate.middleware';
import { hotelQuerySchema, availabilityQuerySchema } from '../schemas/hotel.schema';

const router = Router();

// GET /api/hotels
router.get('/', validateQuery(hotelQuerySchema), async (req, res, next) => {
  try {
    const result = await hotelService.findAll(req.query as any);
    res.json({
      success: true,
      data: result.hotels,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hotels/amenities
router.get('/amenities', async (req, res, next) => {
  try {
    const amenities = await hotelService.getAmenities();
    res.json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res, next) => {
  try {
    const hotel = await hotelService.findById(req.params.id);
    res.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hotels/:id/availability
router.get(
  '/:id/availability',
  validateQuery(availabilityQuerySchema),
  async (req, res, next) => {
    try {
      const { checkIn, checkOut, roomId, rooms } = req.query as any;
      const availability = await hotelService.checkAvailability(
        req.params.id,
        new Date(checkIn),
        new Date(checkOut),
        roomId,
        rooms || 1
      );
      res.json({
        success: true,
        data: availability,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
