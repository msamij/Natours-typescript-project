import './config.js';
import mongoose from 'mongoose';
import app from './index.js';
import { getEnvVar } from './config.js';

const DB = getEnvVar('DATABASE').replace('<PASSWORD>', getEnvVar('DATABASE_PASSWORD'));

mongoose.connect(DB).then(() => {
  console.log('DB connection successfull');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
