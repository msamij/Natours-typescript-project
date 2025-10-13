import express, { type Express, type NextFunction, type Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { ErrorHandler } from './types/Error.js';
import { type RequestWithTime } from './types/Request.js';

const __dirname = path.resolve();

const app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: RequestWithTime, _: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('{/*splat}', (req, _, next) => {
  const error = new ErrorHandler(`Can't find ${req.originalUrl} on this server!`);
  error.status = 'fail';
  error.statusCode = 404;
  next(error);
});

const errorHandler: express.ErrorRequestHandler = (err: ErrorHandler, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

app.use(errorHandler);

export default app;
