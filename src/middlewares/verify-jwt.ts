import {Status} from '@/enum/status';
import {ResponseError} from '@/lib/http/error';
import {MiddlewareContext} from '@/lib/http/interface';
import {jwt} from '@/lib/jwt';
import {LdapJwtPayload} from '@/lib/ldap/interface';

interface Auth {
  user: LdapJwtPayload;
}

export async function verifyJWT(context: MiddlewareContext<Auth>) {
  const token = context.headers.authorization?.split(' ')?.[1];
  if (!token) {
    throw new ResponseError({
      message: 'Not have token',
      status: Status.UNAUTHORIZED,
    });
  }

  try {
    const payload = jwt.verify<LdapJwtPayload>(token);

    context.user = payload;

    return context.next();
  } catch (error) {
    throw new ResponseError({
      message: 'Invalid token',
      status: Status.UNAUTHORIZED,
    });
  }
}
