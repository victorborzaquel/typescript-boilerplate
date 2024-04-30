import {Router} from 'express';
import {authenticate} from './authenticate';
import {verify} from './verify';

const routes = Router();

routes.use('/authenticate', authenticate);
routes.post('/verify', verify);

export {routes};
