import dotenv from 'dotenv';
import path from 'path';

const ENV_PATH = path.resolve('./src/config.env');
dotenv.config({ path: ENV_PATH });
