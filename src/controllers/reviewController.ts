import type { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel.js';
import type { RequestWithUser } from '../types/Types.js';
import * as factory from './handlerFactory.js';

export const setTourUserIds = (req: Request, _res: Response, next: NextFunction) => {
  const request = req as RequestWithUser;

  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.user.id;
  next();
};

export const getAllReviews = factory.getAll(Review);

export const createReview = factory.createOne(Review);

export const getReview = factory.getOne(Review);

export const deleteReview = factory.deleteOne(Review);

export const updateReview = factory.updateOne(Review);
