import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import {env} from './config/env';
import {clientErrorHandler, errorHandler, logErrors} from './handlers/error';
import {authenticate, verify} from './routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
// app.use(logErrors);
// app.use(clientErrorHandler);
// app.use(errorHandler);

app.use('/authenticate', authenticate);
// app.use('/verify', verify);

app.listen(env.APP_PORT, () => {
  console.log(`App listening on port ${env.APP_PORT}`);
});
