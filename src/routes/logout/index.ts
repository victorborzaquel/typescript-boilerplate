import {createRoute} from '@/lib/http';
import {verifyJWT} from '@/middlewares/verify-jwt';

export const logout = createRoute({
  middlewares: [verifyJWT],
  handler: async ({response, employee}) => response(employee),
});
