import * as jsonwebtoken from 'jsonwebtoken';
import * as moment from 'moment';
import {env} from '../env';
import {PGMJwtPayload} from './interface';

/**
 * JWT helper
 */
export class JwtProvider {
  /**
   * Generate JWT token
   */
  sign(payload: PGMJwtPayload): string {
    const {sub} = payload;
    const send: jsonwebtoken.JwtPayload & PGMJwtPayload = {
      sub,
      exp: parseInt(moment().add(2, 'days').format('X')),
    };
    return jsonwebtoken.sign(send, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
    });
  }
  /**
   * Validate JWT token
   * @throws Error if token is invalid or expired
   */
  verify(token: string): PGMJwtPayload {
    console.log(env.JWT_SECRET);
    return jsonwebtoken.verify(token, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
    }) as PGMJwtPayload;
  }
  /**
   * Get proprieties from JWT token
   */
  decode(token: string): PGMJwtPayload {
    return jsonwebtoken.decode(token) as PGMJwtPayload;
  }
}
