import {randomUUID} from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import * as moment from 'moment';
import {env} from '../env';
import {PGMJwtPayload} from './interface';

/**
 * JWT helper
 */
class Jwt {
  /**
   * Generate JWT token
   */
  sign(payload: PGMJwtPayload): string {
    const {
      aud,
      exp = parseInt(moment().add(2, 'days').format('X')),
      iat = Date.now(),
      iss = env.JWT_ISSUER,
      jti = randomUUID(),
      nbf = Date.now(),
      sub,
    } = payload;
    return jsonwebtoken.sign({sub, exp}, env.JWT_SECRET, {
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
export const jwt = new Jwt();
