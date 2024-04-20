import {createRoute} from '@/lib/http';
import {verifyJWT} from '@/middlewares/verify-jwt';

export const profile = createRoute({
  middlewares: [verifyJWT],
  handler: async ({user}) => {},
});
