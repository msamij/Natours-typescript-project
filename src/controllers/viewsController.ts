import Tour from '../models/tourModel.js';
import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';

export const getOverview = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});

export const getTour = (_req: Request, res: Response) => {
  const tour = await Tour.findOne();
  res.status(200).render('tour', { title: 'The Forest Hiker' });
};
