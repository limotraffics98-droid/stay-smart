import { Router, Response } from 'express';
import { reviewService } from '../services/review.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validate.middleware';
import { createReviewSchema, reviewQuerySchema } from '../schemas/review.schema';

const router = Router();

// GET /api/reviews/hotel/:hotelId
router.get('/hotel/:hotelId', validateQuery(reviewQuerySchema), async (req, res, next) => {
  try {
    const result = await reviewService.findByHotel(req.params.hotelId, req.query as any);
    res.json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/hotel/:hotelId
router.post(
  '/hotel/:hotelId',
  authenticate,
  validate(createReviewSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const review = await reviewService.create(
        req.user!.userId,
        req.params.hotelId,
        req.body
      );
      res.status(201).json({
        success: true,
        data: review,
        message: 'Review submitted',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
