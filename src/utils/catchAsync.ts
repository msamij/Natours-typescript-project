import { type NextFunction, type Request, type Response } from 'express';
import { AppError } from './appError.js';

type ControllerFn<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => Promise<void>;

type appErrorType = {
  [key: string]: any;
  isOperational: boolean;
  message: string;
  statusCode: number;
  status?: string | undefined;
  name: string;
  stack?: string;
  cause?: unknown;
};

export const catchAsync = <T extends Request = Request>(fn: ControllerFn<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as T, res, next).catch(err => {
      const error: appErrorType = Object.assign(new AppError(err.message, 404), err);
      error.name = err.name;
      next(error);
    });
  };
};
