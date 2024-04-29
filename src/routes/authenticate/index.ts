import {Router} from 'express';
import {authenticateFromApiKey} from './from-api-key';
import {authenticateFromLdap} from './from-ldap';

const authenticate = Router();

authenticate.post('/ldap', authenticateFromLdap);
authenticate.post('/api-key', authenticateFromApiKey);

export {authenticate};
