import '../config.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Tour from '../models/tourModel.js';
import { getEnvVar } from '../config.js';
import { logger } from '../logger.js';

const DB = getEnvVar('DATABASE').replace('<PASSWORD>', getEnvVar('DATABASE_PASSWORD'));

mongoose.connect(DB).then(() => {
  logger.info('DB connection succesfull');
});

const __dirname = path.resolve();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    logger.info('Data loaded successfully!');
  } catch (err) {
    logger.error(`An error occured wrong while loading data: ${err}`);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    logger.info('Data deleted successfully!');
  } catch (err) {
    logger.error(`An error occured wrong while deleting data: ${err}`);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
