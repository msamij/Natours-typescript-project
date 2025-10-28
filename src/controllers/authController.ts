import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { jwtVerifyPromisified } from '../utils/jwtVerifyPromisify.js';
import type { RequestWithUser } from '../types/Request.js';

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    // Although JWT_EXPIRES_IN is defined as a string like this => 90d
    // But to make TS happy, I am defining it as a number and since expiresIn can be of type (number) TS is happy.
    expiresIn: process.env.JWT_EXPIRES_IN as unknown as number,
  });
};

export const signup = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body?.role,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctedPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export const protect = catchAsync(async (req: RequestWithUser, _res: Response, next: NextFunction) => {
  let token: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]!;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }

  const decoded = await jwtVerifyPromisified(token, process.env.JWT_SECRET as string);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exists', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again', 401));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles: string[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const request = req as RequestWithUser;

    if (!roles.includes(request.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};
