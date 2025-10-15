import { type NextFunction, type Request, type Response } from 'express';

type ControllerFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: ControllerFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
