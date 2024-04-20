export interface LdapUser {
  sAMAccountName: string;
  userPrincipalName: string;
  name: string;
  givenName: string;
  description: string;
  dn: string;
}
