import type { NextFunction, Request, Response } from 'express';

export interface RequestWithTime extends Request {
  requestTime?: string;
}

export interface RequestWithSlug extends Request {
  params: {
    slug: string;
  };
}

export interface RequestWithYear extends Request {
  params: {
    year: string;
  };
}

export interface RequestWithToken extends Request {
  params: {
    token: string;
  };
}

export interface RequestWithGeoCoordinates extends Request {
  params: {
    distance: string;
    latlng: string;
    unit: string;
  };
}

export interface RequestWithUser extends Request {
  user: {
    id?: string;
    name: string;
    role: string;
    email: string;
    password: string;
    passwordConfirm: string;
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

export type SendEmailOptions = {
  email: string;
  subject: string;
  message: string;
  html?: string;
};
