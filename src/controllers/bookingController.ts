import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError.js';
import Tour from '../models/tourModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

export const getCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tour = await Tour.findById(req.params.tourId);
});
