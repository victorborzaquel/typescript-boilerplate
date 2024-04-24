import {createRoute} from '@/lib/http';
import {verifyJWT} from '@/middlewares/verify-jwt';
import {EmployeePresenter} from '@/presenters/employee';

export const verify = createRoute({
  middlewares: [verifyJWT],
  handler: async ({response, employee}) =>
    response(new EmployeePresenter(employee)),
});
