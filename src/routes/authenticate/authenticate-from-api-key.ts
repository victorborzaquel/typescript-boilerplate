import {Status} from '@/enum/status';
import {extractDnRoles} from '@/helpers/ldap';
import {env} from '@/lib/env';
import {createRoute} from '@/lib/http';
import {jwt} from '@/lib/jwt';
import {z} from 'zod';

export const authenticateFromApiKey = createRoute({
  status: Status.CREATED,
  schemas: {
    query: z.object({apiKey: z.literal(env.API_KEY)}),
    body: z.object({
      sAMAccountName: z.string(),
      userPrincipalName: z.string(),
      name: z.string().optional(),
      givenName: z.string().optional(),
      description: z.string().optional(),
      dn: z.string(),
    }),
  },
  handler: async ({body, response}) => {
    const token = jwt.sign({
      sub: body.sAMAccountName,
      login: body.userPrincipalName,
      fullName: body.name ?? null,
      givenName: body.givenName ?? null,
      description: body.description ?? null,
      roles: extractDnRoles(body.dn),
    });

    return response(token);
  },
});
