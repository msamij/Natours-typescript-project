import express, { type Express, type NextFunction, type Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { type RequestWithTime } from './types/Request.js';
import { AppError } from './utils/appError.js';

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
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
