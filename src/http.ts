import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import {authenticate} from './routes/authenticate';
import {exit} from './routes/exit';
import {logout} from './routes/logout';
import {verify} from './routes/verify';

const http = express();

http.use(cors());
http.use(bodyParser.json());
http.use(bodyParser.urlencoded({extended: false}));
http.use(methodOverride());

http.use('/authenticate', authenticate);
http.post('/verify', verify);
http.post('/logout', logout);
http.post('/exit', exit);

export {http};
