import express, { type Response } from 'express';
import { AppError } from '../utils/appError.js';
import { logger } from '../logger.js';

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    logger.error(`ERROR 🎇 ${err}`);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const errorHandler: express.ErrorRequestHandler = (err: AppError, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
