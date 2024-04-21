import {Status} from '@/enum/status';
import {env} from '@/lib/env';
import * as LdapAuth from 'ldapauth-fork';
import {ResponseError} from '../http/error';
import {LdapUser} from './interface';

function createAuth() {
  if (env.APP_AUTH === 'ldap') {
    return new LdapAuth({
      url: env.LDAP_URL,
      bindCredentials: env.LDAP_BIND_CREDENTIALS,
      searchBase: env.LDAP_SEARCH_BASE,
      searchFilter: env.LDAP_SEARCH_FILTER,
      timeout: env.LDAP_TIMEOUT,
      connectTimeout: env.LDAP_CONNECTION_TIMEOUT,
      reconnect: env.LDAP_RECONNECT,
      bindDN: env.LDAP_BIND_DN,
    });
  } else {
    return null;
  }
}

let auth = createAuth();

function reconnect() {
  auth = createAuth();
}

/**
 * Authenticate user with ldap
 */
export async function ldap(username: string, password: string) {
  return new Promise<LdapUser>((resolve, reject) => {
    if (auth) {
      auth.authenticate(username, password, (err, user: LdapUser) => {
        if (err) {
          const isString = typeof err === 'string';
          if (
            (!isString && err.name === 'InvalidCredentialsError') ||
            (isString && RegExp(/no such user/i).exec(err))
          ) {
            reject(
              new ResponseError({
                message: 'Wrong user or password',
                status: Status.CONFLICT,
              })
            );
          }

          reconnect();
          reject(typeof err === 'string' ? new Error(err) : err);
        }
        if (!user) {
          reject(
            new ResponseError({
              message: 'User not found',
              status: Status.NOT_FOUND,
            })
          );
        }

        resolve(user);
      });
    } else {
      reject(
        new ResponseError({
          message: 'Ldap auth not configured',
          status: Status.INTERNAL_SERVER_ERROR,
        })
      );
    }
  });
}
