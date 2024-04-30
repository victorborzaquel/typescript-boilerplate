import 'dotenv/config';
import 'reflect-metadata';
import {http} from './http';
import {env} from './lib/env';
import {Logger} from './lib/logger';
import {db} from './lib/typeorm';

async function server() {
  const logger = new Logger('server');
  await db.initialize();
  http.listen(env.APP_PORT, () => {
    logger.info(`Http listening on port ${env.APP_PORT}`);
  });
}
server();
