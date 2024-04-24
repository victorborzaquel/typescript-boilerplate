import {Employee} from '@/database/entities/employee';
import {extractDnRoles} from '@/helpers/ldap';

export class EmployeePresenter {
  readonly id: string;
  readonly roles: string[];
  readonly fullName: string | null;
  readonly givenName: string | null;

  constructor(entity: Employee) {
    this.id = entity.number;
    this.roles = extractDnRoles(entity.dn);
    this.fullName = entity.fullName;
    this.givenName = entity.givenName;
  }
}
