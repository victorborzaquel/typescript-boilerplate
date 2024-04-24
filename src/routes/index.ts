import {Router} from 'express';
import {authenticate} from './authenticate';
import {exit} from './exit';
import {logout} from './logout';
import {verify} from './verify';

const routes = Router();

routes.post('authenticate', authenticate);
routes.post('verify', verify);
routes.post('logout', logout);
routes.post('exit', exit);

export {routes};
