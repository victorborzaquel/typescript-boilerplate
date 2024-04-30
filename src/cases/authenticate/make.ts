import {JwtProvider} from '@/lib/jwt';
import {EmployeeRepository} from '@/repositories/employee';
import {AuthenticateCase} from './case';

export function makeAuthenticateCase() {
  const employeeRepository = new EmployeeRepository();
  const jwtProvider = new JwtProvider();
  return new AuthenticateCase(employeeRepository, jwtProvider);
}
