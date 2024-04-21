import {Status} from '@/enum/status';
import {extractDnRoles} from '@/helpers/ldap';
import {createRoute} from '@/lib/http';
import {jwt} from '@/lib/jwt';
import {ldap} from '@/lib/ldap';
import {z} from 'zod';

export const authenticate = createRoute({
  status: Status.CREATED,
  schemas: {body: z.object({username: z.string(), password: z.string()})},
  handler: async ({body, response}) => {
    const user = await ldap(body.username, body.password);

    const token = jwt.sign({
      sub: user.sAMAccountName,
      login: user.userPrincipalName,
      fullName: user.name || null,
      givenName: user.givenName || null,
      description: user.description || null,
      roles: extractDnRoles(user.dn),
    });

    return response(token);
  },
});
