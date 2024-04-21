import {Router} from 'express';
import {authenticateFromApiKey} from './authenticate-from-api-key';
import {authenticateFromLdap} from './authenticate-from-ldap';

const authenticate = Router();

authenticate.post('ldap', authenticateFromLdap);
authenticate.post('api-key', authenticateFromApiKey);

export {authenticate};
