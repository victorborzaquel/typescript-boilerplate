import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import {env} from '../env';

export const jwt = {
  sign<Payload extends object>(payload: Payload) {
    return jsonwebtoken.sign(payload, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
      expiresIn: parseInt(moment().add(2, 'days').format('X')),
    });
  },
  verify<Payload>(token: string) {
    return jsonwebtoken.verify(token, env.JWT_SECRET) as Payload;
  },
};
