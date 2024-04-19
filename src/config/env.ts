import 'dotenv/config';
import {z} from 'zod';

const schema = z.object({
  APP_PROFILE: z.enum(['development', 'production']),
  JWT_SECRET: z.string(),
  LDAP_URL: z.string(),
  LDAP_BIND_DN: z.string(),
  LDAP_BIND_CREDENTIALS: z.string(),
  LDAP_SEARCH_BASE: z.string(),
  LDAP_SEARCH_FILTER: z.string(),
  LDAP_TIMEOUT: z.string().transform(value => parseInt(value, 10)),
  LDAP_CONNECTION_TIMEOUT: z.string().transform(value => parseInt(value, 10)),
  APP_PORT: z.string().transform(value => parseInt(value, 10)),
  LDAP_RECONNECT: z
    .enum(['true', 'false'])
    .transform(value => value === 'true'),
});

const validateEnv = schema.parse(process.env);

export const env = {
  ...validateEnv,
  isDevelopment: validateEnv.APP_PROFILE === 'development',
  isProduction: validateEnv.APP_PROFILE === 'production',
};
