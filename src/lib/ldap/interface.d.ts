import {JwtPayload} from 'jsonwebtoken';

export interface UserLdap {
  sAMAccountName: string;
  userPrincipalName: string;
  name: string;
  givenName: string;
  description: string;
  dn: string;
}

export interface LdapJwtPayload extends JwtPayload {
  sub: string;
  login: string | null;
  roles: string[];
  fullName: string | null;
  givenName: string | null;
  description: string | null;
}
