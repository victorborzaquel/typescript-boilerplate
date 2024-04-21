import {z} from 'zod';

const baseSchema = z.object({
  APP_PROFILE: z.enum(['development', 'production']),
  APP_PORT: z.string().transform(value => parseInt(value, 10)),
  JWT_SECRET: z.string(),
  JWT_ISSUER: z.string(),
  APP_AUTH: z.enum(['ldap', 'local']),
});

const ldapSchema = z.object({
  APP_AUTH: z.literal('ldap'),
  LDAP_URL: z.string(),
  LDAP_BIND_DN: z.string(),
  LDAP_BIND_CREDENTIALS: z.string(),
  LDAP_SEARCH_BASE: z.string(),
  LDAP_SEARCH_FILTER: z.string(),
  LDAP_TIMEOUT: z.string().transform(value => parseInt(value, 10)),
  LDAP_CONNECTION_TIMEOUT: z.string().transform(value => parseInt(value, 10)),
  LDAP_RECONNECT: z
    .enum(['true', 'false'])
    .transform(value => value === 'true'),
});

const localSchema = z.object({
  APP_AUTH: z.literal('local'),
});

const authSchema = z.discriminatedUnion('APP_AUTH', [ldapSchema, localSchema]);

const parse = baseSchema.and(authSchema).parse(process.env);

/**
 * Environment variables
 */
export const env = {
  ...parse,
  isDevelopment: parse.APP_PROFILE === 'development',
  isProduction: parse.APP_PROFILE === 'production',
};
