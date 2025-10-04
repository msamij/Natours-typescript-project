import './config.js';
import mongoose from 'mongoose';
import app from './index.js';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

const DB = getEnvVar('DATABASE').replace('<PASSWORD>', getEnvVar('DATABASE_PASSWORD'));

mongoose.connect(DB).then(con => {
  console.log(con.connections);
  console.log('DB connection successfull');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
