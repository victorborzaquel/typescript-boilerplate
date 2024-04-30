import {createRoute} from '@/lib/http';
import {verifyApiKey} from '@/middlewares/verify-api-key';
import {verifyJWT} from '@/middlewares/verify-jwt';
import {EmployeePresenter} from '@/presenters/employee';

export const verify = createRoute({
  middlewares: [verifyJWT, verifyApiKey('ADMIN', 'USER')],
  handler: async ({employee}) => new EmployeePresenter(employee),
});
