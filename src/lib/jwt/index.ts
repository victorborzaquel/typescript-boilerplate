import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import {env} from '../env';
import {PGMJwtPayload} from './interface';

/**
 * JWT helper
 */
export const jwt = {
  /**
   * Generate JWT token
   */
  sign(payload: PGMJwtPayload): string {
    return jsonwebtoken.sign(payload, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
      expiresIn: parseInt(moment().add(2, 'days').format('X')),
    });
  },
  /**
   * Validate JWT token
   * @throws Error if token is invalid or expired
   */
  verify(token: string): PGMJwtPayload {
    return jsonwebtoken.verify(token, env.JWT_SECRET) as PGMJwtPayload;
  },
  /**
   * Get proprieties from JWT token
   */
  decode(token: string): PGMJwtPayload {
    return jsonwebtoken.decode(token) as PGMJwtPayload;
  },
};
