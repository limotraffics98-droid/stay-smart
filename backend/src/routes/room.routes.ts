import { Router } from 'express';
import { roomService } from '../services/room.service';

const router = Router();

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res, next) => {
  try {
    const room = await roomService.findById(req.params.roomId);
    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hotels/:hotelId/rooms (mounted in hotel routes context)
router.get('/hotel/:hotelId', async (req, res, next) => {
  try {
    const rooms = await roomService.findByHotel(req.params.hotelId);
    res.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
