import type { Request } from 'express';

export interface RequestWithTime extends Request {
  requestTime?: string;
}
