import Tour from '../models/tourModel.js';
import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import type { RequestWithSlug } from '../types/Types.js';

export const getOverview = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(async (req: RequestWithSlug, res: Response) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  res.status(200).render('tour', {
    title: `${tour?.name} Tour`,
    tour,
  });
});
