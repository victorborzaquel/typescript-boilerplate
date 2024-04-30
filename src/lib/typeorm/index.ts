import 'dotenv/config';
import 'reflect-metadata';
import {DataSource} from 'typeorm';
/**
 * Create a new DataSource instance
 */
export const db = new DataSource({
  type: String(process.env.DB_TYPE) as 'mssql',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  synchronize:
    process.env.APP_PROFILE === 'development' &&
    process.env.DB_SINCRONIZE === 'true',
  logging:
    process.env.APP_PROFILE === 'development' &&
    process.env.DB_LOGGING === 'true',
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  entities: [`${__dirname}/entities/*.{ts,js}`],
  extra: {trustServerCertificate: true},
});
