export interface JwtPayload {
  sub: string;
  login: string | null;
  roles: string[];
  fullName: string | null;
  givenName: string | null;
  description: string | null;
}
