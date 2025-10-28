import type { Request } from 'express';

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
