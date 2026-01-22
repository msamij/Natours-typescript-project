import type { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel.js';
import type { RequestWithUser } from '../types/Types.js';
import { catchAsync } from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

export const getAllReviews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async (req: RequestWithUser, res: Response, _next: NextFunction) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    review: newReview,
  });
});

export const deleteReview = factory.deleteOne(Review);
