import {Status} from '@/enum/status';
import {ResponseError} from '@/lib/http/error';
import {MiddlewareContext} from '@/lib/http/interface';
import {jwt} from '@/lib/jwt';
import {PGMJwtPayload} from '@/lib/jwt/interface';

interface Auth {
  user: PGMJwtPayload;
}

/**
 * Middleware to verify JWT token from Authorization header and set user in context
 */
export async function verifyJWT(
  context: MiddlewareContext<Auth>
): Promise<void> {
  const token = context.headers.authorization?.split(' ')?.[1];
  if (!token) {
    throw new ResponseError({
      message: 'Authorization token is missing',
      status: Status.UNAUTHORIZED,
    });
  }

  try {
    const payload = jwt.verify(token);

    context.user = payload;

    return context.next();
  } catch (error) {
    throw new ResponseError({
      message: 'Authorization token is invalid',
      status: Status.UNAUTHORIZED,
    });
  }
}
