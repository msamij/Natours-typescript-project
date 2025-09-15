import express, { type NextFunction, type Response, type Express } from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { type RequestWithTime } from './types/Request.js';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req: RequestWithTime, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
