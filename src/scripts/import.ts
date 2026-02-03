import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import '../config.js';
import { getEnvVar } from '../config.js';
import { logger } from '../logger.js';
import Review from '../models/reviewModel.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';

const DB = getEnvVar('DATABASE').replace('<PASSWORD>', getEnvVar('DATABASE_PASSWORD'));

mongoose.connect(DB).then(() => {
  logger.info('DB connection succesfull');
});

const __dirname = path.resolve();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    logger.info('Data imported successfully!');
  } catch (err) {
    logger.error(`An error occured wrong while loading data: ${err}`);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
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
