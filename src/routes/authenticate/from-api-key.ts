import {makeAuthenticateCase} from '@/cases/authenticate/make';
import {Status} from '@/enum/status';
import {createRoute} from '@/lib/http';
import {verifyApiKey} from '@/middlewares/verify-api-key';
import {z} from 'zod';
import {AuthenticatePresenter} from './../../presenters/token';

export const authenticateFromApiKey = createRoute({
  status: Status.CREATED,
  middlewares: [verifyApiKey('ADMIN')],
  schemas: {
    body: z.object({
      employeeId: z.string(),
      dn: z.string(),
      givenName: z.string().optional(),
      fullName: z.string().optional(),
    }),
  },
  handler: async ({body}) => {
    const response = await makeAuthenticateCase().execute(body);
    return new AuthenticatePresenter(response);
  },
});
