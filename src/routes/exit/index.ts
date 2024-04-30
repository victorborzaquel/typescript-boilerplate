import {createRoute} from '@/lib/http';
import {verifyJWT} from '@/middlewares/verify-jwt';

export const exit = createRoute({
  middlewares: [verifyJWT],
  handler: async ({employee}) => employee,
});
