import express from 'express';
import type { AppError } from '../utils/appError.js';

export const errorHandler: express.ErrorRequestHandler = (err: AppError, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
