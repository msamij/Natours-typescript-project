import type { NextFunction, Request, Response } from 'express';
import type mongoose from 'mongoose';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const deleteOne = <T>(Model: mongoose.Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No document found with the ID: ${req.params.id}`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

export const updateOne = <T>(Model: mongoose.Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No document found with the ID: ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

export const createOne = <T>(Model: mongoose.Model<T>) => {
  return catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        data: doc,
      },
    });
  });
};

export const getOne = <T>(Model: mongoose.Model<T>, popOptions?: mongoose.PopulateOptions) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No document found with the ID: ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};
