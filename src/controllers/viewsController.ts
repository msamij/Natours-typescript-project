import type { NextFunction, Request, Response } from 'express';
import Tour from '../models/tourModel.js';
import type { RequestWithSlug } from '../types/Types.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

export const getOverview = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(async (req: RequestWithSlug, res: Response, next: NextFunction) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour?.name} Tour`,
    tour,
  });
});

export const getLoginForm = catchAsync(async (_req: Request, res: Response) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
