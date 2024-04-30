import {JwtProvider} from '@/lib/jwt';
import {db} from '@/lib/typeorm';
import {Employee} from '@/lib/typeorm/entities/employee';
import {AuthenticateCase} from './case';

export function makeAuthenticateCase() {
  const employeeRepository = db.getRepository(Employee);
  const jwtProvider = new JwtProvider();
  return new AuthenticateCase(employeeRepository, jwtProvider);
}
