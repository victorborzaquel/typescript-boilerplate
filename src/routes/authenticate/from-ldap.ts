import { Employee } from '@/database/entities/employee';
import { Status } from '@/enum/status';
import { extractDnRoles } from '@/helpers/ldap';
import { createRoute } from '@/lib/http';
import { jwt } from '@/lib/jwt';
import { ldap } from '@/lib/ldap';
import { db } from '@/lib/typeorm';
import { z } from 'zod';

export const authenticateFromLdap = createRoute({
  status: Status.CREATED,
  schemas: {body: z.object({username: z.string(), password: z.string()})},
  handler: async ({body, response}) => {
    const ldapUser = await ldap(body.username, body.password);
    const employeeRepository = db.getRepository(Employee);
    
    // const currentUpdate = new Employee({
    //   dn: ldapUser.dn,
    //   number: ldapUser.sAMAccountName,
    //   fullName: ldapUser.name,
    //   givenName: ldapUser.givenName,
    // });

    // const employee = await employeeRepository.findOneBy({
    //   number: ldapUser.sAMAccountName,
    // });

    // if (!employee) {
    //   await employeeRepository.save(currentUpdate)
    // } else {

    // }

    // if (
    //   employee.dn !== currentUpdate.dn ||
    //   employee.fullName !== currentUpdate.fullName ||
    //   employee.givenName !== currentUpdate.givenName ||
    //   employee.number !==
    // ) {
    // }

    const token = jwt.sign({
      sub: ldapUser.sAMAccountName,
      login: ldapUser.userPrincipalName,
      fullName: ldapUser.name ?? null,
      givenName: ldapUser.givenName ?? null,
      description: ldapUser.description ?? null,
      roles: extractDnRoles(ldapUser.dn),
    });

    return response(token);
  },
});
