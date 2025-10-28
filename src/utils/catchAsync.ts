import { type NextFunction, type Request, type Response } from 'express';
import { AppError } from './appError.js';

type CatchAsyncCallback<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => Promise<void>;

type AppErrorType = {
  [key: string]: any;
  isOperational: boolean;
  message: string;
  statusCode: number;
  status?: string | undefined;
  name: string;
  stack?: string;
  cause?: unknown;
};

export const catchAsync = <T extends Request = Request>(fn: CatchAsyncCallback<T>) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    fn(_req as T, _res, next).catch(err => {
      const error: AppErrorType = Object.assign(new AppError(err.message, 400), err);
      error.name = err.name;
      next(error);
    });
  };
};
