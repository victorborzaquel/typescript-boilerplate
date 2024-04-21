import {z} from 'zod';

const schema = z.object({
  APP_PROFILE: z.enum(['development', 'production']),
  APP_PORT: z.string().transform(value => parseInt(value, 10)),
  API_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_ISSUER: z.string(),
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

const parse = schema.parse(process.env);

/**
 * Environment variables
 */
export const env = {
  ...parse,
  isDevelopment: parse.APP_PROFILE === 'development',
  isProduction: parse.APP_PROFILE === 'production',
};
