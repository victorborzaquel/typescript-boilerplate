import {Status} from '@/enum/status';
import {env} from '@/lib/env';
import {createRoute} from '@/lib/http';
import {ResponseError} from '@/lib/http/error';
import jwt from 'jsonwebtoken';

export const verify = createRoute({
  handler: async ({headers, response}) => {
    const token = headers.authorization?.split(' ')?.[1];
    if (!token) {
      throw new ResponseError({
        message: 'Not have token',
        status: Status.UNAUTHORIZED,
      });
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET);

      return response(payload);
    } catch (error) {
      throw new ResponseError({
        message: 'Invalid token',
        status: Status.UNAUTHORIZED,
      });
    }
  },
});
