import {DataSource} from 'typeorm';

/**
 * Create a new DataSource instance
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});
