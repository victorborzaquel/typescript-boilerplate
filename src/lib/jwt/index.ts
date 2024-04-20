import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import {env} from '../env';
import {JwtPayload} from './interface';

export const jwt = {
  sign(payload: JwtPayload) {
    return jsonwebtoken.sign(payload, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
      expiresIn: parseInt(moment().add(2, 'days').format('X')),
    });
  },
  verify(token: string) {
    return jsonwebtoken.verify(token, env.JWT_SECRET) as JwtPayload;
  },
};
