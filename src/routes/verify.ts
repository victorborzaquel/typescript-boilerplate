import {createRoute} from '@/lib/http';
import {verifyJWT} from '@/middlewares/verify-jwt';

export const verify = createRoute({
  middlewares: [verifyJWT],
  handler: async ({response, user}) => response(user),
});
