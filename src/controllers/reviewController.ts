import type { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllReviews = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
