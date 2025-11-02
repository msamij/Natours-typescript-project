import jwt from 'jsonwebtoken';
import type { JWTDecoded } from '../types/Types.js';

/**
 * Promise-based version of jwt.verify()
 *
 * Reference: https://stackoverflow.com/questions/75398503/error-when-trying-to-promisify-jwt-in-typescript
 *
 * @param token JWT token
 * @param secret Secret key to verify the token.
 * @returns a decoded JWT token.
 */
export const jwtVerifyPromisified = (token: string, secret: string): Promise<JWTDecoded> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as JWTDecoded);
      }
    });
  });
};
