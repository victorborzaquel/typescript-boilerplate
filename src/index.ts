import 'dotenv/config';
import 'reflect-metadata';
import {http} from './http';
import {env} from './lib/env';
import {db} from './lib/typeorm';

async function server() {
  await db.initialize();
  http.listen(env.APP_PORT, () => {
    console.log(`Http listening on port ${env.APP_PORT}`);
  });
}
server();
