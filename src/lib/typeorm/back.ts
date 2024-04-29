import {Employee} from '@/lib/typeorm/entities/employee';
import {DataSource} from 'typeorm';
import {env} from '../env';
import {CustomNamingStrategy} from './naming-strategy';

/**
 * Create a new DataSource instance
 */
export const db = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.isDevelopment && env.DB_SINCRONIZE,
  logging: env.isDevelopment && env.DB_LOGGING,
  entities: [Employee],
  subscribers: [],
  namingStrategy: new CustomNamingStrategy(),
});
