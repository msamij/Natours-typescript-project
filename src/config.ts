import dotenv from 'dotenv';
import path from 'path';

const ENV_PATH = path.resolve('./src/config.env');
dotenv.config({ path: ENV_PATH });

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}
