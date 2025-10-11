import './config.js';
import mongoose from 'mongoose';
import { getEnvVar } from './config.js';
import app from './index.js';
import { logger } from './logger.js';

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
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
