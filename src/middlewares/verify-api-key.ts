import {Status} from '@/enum/status';
import {env} from '@/lib/env';
import {createMiddleware} from '@/lib/http';
import {ResponseError} from '@/lib/http/error';
import {MiddlewareContext} from '@/lib/http/interface';
import {z} from 'zod';

export enum AppRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
type Role = 'USER' | 'ADMIN';
interface VerifyApiKey {
  query: {secret: string};
}
/**
 * Middleware to verify JWT token from Authorization header and set employee in context
 */
export const verifyApiKey = (role: Role, ...roles: Role[]) => {
  const appRoles = [role, ...roles];
  const keys = appRoles.map(role => env[`${role}_API_KEY`]);

  return createMiddleware({
    schemas: {
      query: z.object({secret: z.string()}),
    },
    handler: async (
      context: MiddlewareContext<VerifyApiKey>
    ): Promise<void> => {
      if (!keys.some(key => context.query.secret === key)) {
        throw new ResponseError({
          message: 'Invalid API key',
          status: Status.UNAUTHORIZED,
        });
      }
    },
  });
};
