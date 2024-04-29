import {Status} from '@/enum/status';
import {createRoute} from '@/lib/http';
import {jwt} from '@/lib/jwt';
import {ldap} from '@/lib/ldap';
import {db} from '@/lib/typeorm';
import {Employee} from '@/lib/typeorm/entities/employee';
import {z} from 'zod';

export const authenticateFromLdap = createRoute({
  status: Status.CREATED,
  schemas: {body: z.object({username: z.string(), password: z.string()})},
  handler: async ({body, response}) => {
    const ldapUser = await ldap(body.username, body.password);
    const employeeRepository = db.getRepository(Employee);
    console.log(ldapUser);
    const employee = await employeeRepository.findOneBy({
      number: ldapUser.sAMAccountName,
    });

    if (!employee) {
      await employeeRepository.save(
        new Employee({
          number: ldapUser.sAMAccountName,
          dn: ldapUser.dn,
          fullName: ldapUser.name,
          givenName: ldapUser.givenName,
        })
      );
    } else {
      let isUpdated = false;
      if (employee.dn !== ldapUser.dn) {
        employee.changeDn(ldapUser.dn);
        isUpdated = true;
      }
      if (ldapUser.givenName && employee.givenName !== ldapUser.givenName) {
        employee.changeGivenName(ldapUser.givenName);
        isUpdated = true;
      }
      if (ldapUser.name && employee.fullName !== ldapUser.name) {
        employee.changeFullName(ldapUser.name);
        isUpdated = true;
      }

      if (isUpdated) {
        await employeeRepository.save(employee);
      }
    }

    const token = jwt.sign({sub: ldapUser.sAMAccountName});

    return response({token});
  },
});
