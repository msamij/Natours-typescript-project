import { type NextFunction, type Request, type Response } from 'express';

type ControllerFn<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = <T extends Request = Request>(fn: ControllerFn<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as T, res, next).catch(next);
  };
};
