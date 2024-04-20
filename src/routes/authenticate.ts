import {Status} from '@/enum/status';
import {createRoute} from '@/lib/http';
import {jwt} from '@/lib/jwt';
import {ldap} from '@/lib/ldap';
import {LdapJwtPayload} from '@/lib/ldap/interface';
import {extractDnRoles} from '@/utils/ldap';
import {z} from 'zod';

export const authenticate = createRoute({
  status: Status.CREATED,
  schemas: {body: z.object({username: z.string(), password: z.string()})},
  handler: async ({body, response}) => {
    const userLdap = await ldap(body.username, body.password);

    const token = jwt.sign<LdapJwtPayload>({
      sub: userLdap.sAMAccountName,
      login: userLdap.userPrincipalName,
      fullName: userLdap.name || null,
      givenName: userLdap.givenName || null,
      description: userLdap.description || null,
      roles: extractDnRoles(userLdap.dn),
    });

    return response(token);
  },
});
