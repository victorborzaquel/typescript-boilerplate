import {createRoute} from '@/lib/app/route';
import {ldap} from '@/strategies/ldap';
import {DnUtil} from '@/utils/dn-util';
import {z} from 'zod';

interface User {
  id: string;
  login: string | null;
  roles: string[];
  fullName: string | null;
  givenName: string | null;
  description: string | null;
}

interface UserLdap {
  sAMAccountName: string;
  userPrincipalName: string;
  name: string;
  givenName: string;
  description: string;
  dn: string;
}

export const authenticate = createRoute({
  schemas: {
    body: z.object({username: z.string(), password: z.string()}),
  },
  handler: async ({body, response}) => {
    console.log(body);
    const userLdap = await ldap<UserLdap>(body.username, body.password);

    const user: User = {
      id: userLdap.sAMAccountName,
      login: userLdap.userPrincipalName,
      fullName: userLdap.name || null,
      givenName: userLdap.givenName || null,
      description: userLdap.description || null,
      roles: DnUtil.extractRoles(userLdap.dn),
    };

    response(user);
  },
});
