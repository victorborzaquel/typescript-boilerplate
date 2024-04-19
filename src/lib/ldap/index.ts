import {env} from '@/config/env';
import * as LdapAuth from 'ldapauth-fork';

console.log(env.LDAP_URL);
export const ldapAuth = new LdapAuth({
  url: env.LDAP_URL,
  bindCredentials: env.LDAP_BIND_CREDENTIALS,
  searchBase: env.LDAP_SEARCH_BASE,
  searchFilter: env.LDAP_SEARCH_FILTER,
  timeout: env.LDAP_TIMEOUT,
  connectTimeout: env.LDAP_CONNECTION_TIMEOUT,
  reconnect: env.LDAP_RECONNECT,
  bindDN: env.LDAP_BIND_DN,
});
