import type { NextFunction, Request, Response } from 'express';

export interface RequestWithTime extends Request {
  requestTime?: string;
}

export interface RequestWithYear extends Request {
  params: {
    year: string;
  };
}

export interface RequestWithUser extends Request {
  user: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role: string;
  };
}

export type CatchAsyncCallback<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => Promise<void>;

export type CatchAsyncError = {
  [key: string]: any;

  name: string;
  message: string;
  statusCode: number;
  isOperational: boolean;

  status?: string | undefined;
  stack?: string;
  cause?: unknown;
};

export type JWTDecoded = {
  id: string;
  iat: number;
  exp: number;
};
