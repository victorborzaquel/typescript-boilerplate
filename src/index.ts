import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import 'reflect-metadata';
import {env} from './lib/env';
import {authenticate, verify} from './routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());

app.post('/authenticate', authenticate);
app.get('/verify', verify);

app.listen(env.APP_PORT, () => {
  console.log(`App listening on port ${env.APP_PORT}`);
});
