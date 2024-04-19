import {ldapAuth} from '@/lib/ldap';

export function ldap<User>(username: string, password: string) {
  return new Promise<User>((resolve, reject) => {
    ldapAuth.authenticate(username, password, (err, user: User) => {
      if (err) {
        reject(err);
      }
      if (!user) {
        reject(new Error('User not found'));
      }

      resolve(user);
    });
  });
}
