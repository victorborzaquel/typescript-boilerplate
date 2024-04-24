import {createRoute} from '@/lib/http';
import {verifyJWT} from '@/middlewares/verify-jwt';

export const logout = createRoute({
  middlewares: [verifyJWT],
  handler: async ({response, user}) => response(user),
});
