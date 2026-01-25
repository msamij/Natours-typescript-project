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

export const setTourUserIds = (req: Request, _res: Response, next: NextFunction) => {
  const request = req as RequestWithUser;

  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.user.id;
  next();
};

export const createReview = factory.createOne(Review);

export const deleteReview = factory.deleteOne(Review);

export const updateReview = factory.updateOne(Review);
