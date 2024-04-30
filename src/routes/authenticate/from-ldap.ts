import {makeAuthenticateCase} from '@/cases/authenticate/make';
import {Status} from '@/enum/status';
import {createRoute} from '@/lib/http';
import {ldap} from '@/lib/ldap';
import {AuthenticatePresenter} from '@/presenters/token';
import {z} from 'zod';

export const authenticateFromLdap = createRoute({
  status: Status.CREATED,
  schemas: {body: z.object({username: z.string(), password: z.string()})},
  handler: async ({body}) => {
    const ldapUser = await ldap(body.username, body.password);

    const response = await makeAuthenticateCase().execute({
      dn: ldapUser.dn,
      employeeId: ldapUser.sAMAccountName,
      fullName: ldapUser.name,
      givenName: ldapUser.givenName,
    });
    return new AuthenticatePresenter(response);
  },
});
