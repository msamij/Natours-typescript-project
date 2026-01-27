import { type NextFunction, type Request, type Response } from 'express';
import * as factory from '../controllers/handlerFactory.js';
import User from '../models/userModel.js';
import type { RequestWithUser } from '../types/Types.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

export const updateMe = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = (_req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

export const getAllUsers = factory.getAll(User);

export const getUser = factory.getOne(User);

export const updateUser = factory.updateOne(User);

export const deleteUser = factory.deleteOne(User);
