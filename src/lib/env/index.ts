import {validStringBoolean, validStringNumber} from '@/helpers/zod';
import {z} from 'zod';

const schema = z.object({
  APP_PROFILE: z.enum(['development', 'production']),
  APP_PORT: validStringNumber(),
  ADMIN_API_KEY: z.string(),
  USER_API_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_ISSUER: z.string(),
  LDAP_URL: z.string(),
  LDAP_BIND_DN: z.string(),
  LDAP_BIND_CREDENTIALS: z.string(),
  LDAP_SEARCH_BASE: z.string(),
  LDAP_SEARCH_FILTER: z.string(),
  LDAP_TIMEOUT: validStringNumber(),
  LDAP_CONNECTION_TIMEOUT: validStringNumber(),
  LDAP_RECONNECT: validStringBoolean(),
  DB_TYPE: z.enum(['postgres', 'mssql']),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: validStringNumber(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SINCRONIZE: validStringBoolean().default('false'),
  DB_LOGGING: validStringBoolean().default('false'),
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
