import {JwtProvider} from '@/lib/jwt';
import {Employee} from '@/lib/typeorm/entities/employee';
import {Repository} from 'typeorm';

interface Dto {
  employeeId: string;
  dn: string;
  fullName?: string;
  givenName?: string;
}

interface Response {
  token: string;
}

export class AuthenticateCase {
  constructor(
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtProvider: JwtProvider
  ) {}
  async execute({dn, employeeId, fullName, givenName}: Dto): Promise<Response> {
    const employee = await this.employeeRepository.findOneBy({
      number: employeeId,
    });

    if (!employee) {
      await this.employeeRepository.save(
        new Employee({number: employeeId, dn, fullName, givenName})
      );
    } else {
      let isUpdated = false;
      if (employee.dn !== dn) {
        employee.changeDn(dn);
        isUpdated = true;
      }
      if (givenName && employee.givenName !== givenName) {
        employee.changeGivenName(givenName);
        isUpdated = true;
      }
      if (fullName && employee.fullName !== fullName) {
        employee.changeFullName(fullName);
        isUpdated = true;
      }

      if (isUpdated) {
        await this.employeeRepository.save(employee);
      }
    }

    const token = this.jwtProvider.sign({sub: employeeId});

    return {token};
  }
}
