import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import {routes} from './routes';

const http = express();

http.use(cors());
http.use(bodyParser.json());
http.use(bodyParser.urlencoded({extended: false}));
http.use(methodOverride());

http.use('', routes);

export {http};
