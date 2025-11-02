import { type NextFunction, type Request, type Response } from 'express';
import type { CatchAsyncCallback, CatchAsyncError } from '../types/Types.js';
import { AppError } from './appError.js';

export const catchAsync = <T extends Request = Request>(fn: CatchAsyncCallback<T>) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    fn(_req as T, _res, next).catch(err => {
      const error: CatchAsyncError = Object.assign(new AppError(err.message, 400), err);
      error.name = err.name;
      next(error);
    });
  };
};
