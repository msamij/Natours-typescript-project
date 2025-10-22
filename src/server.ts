import mongoose from 'mongoose';
import { logger } from './logger.js';

process.on('uncaughtException', (err: any) => {
  logger.info('UNCAUGHT EXCEPTION 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

import './config.js';
import { getEnvVar } from './config.js';
import app from './index.js';

const DB = getEnvVar('DATABASE').replace('<PASSWORD>', getEnvVar('DATABASE_PASSWORD'));

mongoose
  .connect(DB)
  .then(() => {
    logger.info('DB connection successfull');
  })
  .catch(err => {
    logger.error(`Error connecting with mongoDB ${err}`);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});

process.on('unhandledRejection', (err: any) => {
  logger.info('UNHANDLED REJECTION 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
