import type { NextFunction, Request, Response } from 'express';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import type { RequestWithSlug, RequestWithUser } from '../types/Types.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { Booking } from '../models/bookingModel.js';

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

export const getLoginForm = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

export const getAccount = (_req: Request, res: Response) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

export const getMyTours = catchAsync(async (req: RequestWithUser, res: Response, _next: NextFunction) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

export const updateUserData = catchAsync(async (req: RequestWithUser, res: Response, _next: NextFunction) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
