import {JwtPayload} from 'jsonwebtoken';

export interface PGMJwtPayload extends JwtPayload {
  sub: string;
  login: string | null;
  roles: string[];
  fullName: string | null;
  givenName: string | null;
  description: string | null;
}
