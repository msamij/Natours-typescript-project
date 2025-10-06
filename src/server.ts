import './config.js';
import mongoose from 'mongoose';
import app from './index.js';
import { getEnvVar } from './config.js';
import { logger } from './logger.js';

const DB = getEnvVar('DATABASE').replace('<PASSWORD>', getEnvVar('DATABASE_PASSWORD'));

mongoose.connect(DB).then(() => {
  logger.info('DB connection successfull');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
