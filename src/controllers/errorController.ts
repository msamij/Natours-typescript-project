import express, { type Request, type Response } from 'express';
import { logger } from '../logger.js';
import { AppError } from '../utils/appError.js';

const handleCastErrorDB = (err: AppError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: AppError) => {
  /**
   * We must extract error field from our error object and since it's wrapped in quotes.
   * had to do it using regex from stack overflow:
   * https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
   */
  const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)![0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AppError) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please login again.', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  // Sending development Error for api.
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Sending development Error for rendered website.
  logger.error(`ERROR 💥 ${err}`);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // Sending production Error for api.
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    logger.error(`ERROR 💥 ${err}`);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // Sending production Error for rendered website.
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }

  logger.error(`ERROR 💥 ${err}`);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

export const errorHandler: express.ErrorRequestHandler = (err: AppError, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errCopy: AppError = { ...err };

    // Making explicit assignment here, since error name and message are not being copied.
    errCopy.name = err.name;
    errCopy.message = err.message;

    if (errCopy.name === 'CastError') {
      errCopy = handleCastErrorDB(errCopy);
    }

    if (errCopy.code === 11000) {
      errCopy = handleDuplicateFieldsDB(errCopy);
    }

    if (errCopy.name === 'ValidationError') {
      errCopy = handleValidationErrorDB(errCopy);
    }

    if (errCopy.name === 'JsonWebTokenError') {
      errCopy = handleJWTError();
    }

    if (errCopy.name === 'TokenExpiredError') {
      errCopy = handleJWTExpiredError();
    }
    sendErrorProd(errCopy, req, res);
  }
};
