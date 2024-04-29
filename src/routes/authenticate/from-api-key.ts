import {Status} from '@/enum/status';
import {env} from '@/lib/env';
import {createRoute} from '@/lib/http';
import {ResponseError} from '@/lib/http/error';
import {jwt} from '@/lib/jwt';
import {db} from '@/lib/typeorm';
import {Employee} from '@/lib/typeorm/entities/employee';
import {verifyApiKey} from '@/middlewares/verify-api-key';
import {z} from 'zod';

export const authenticateFromApiKey = createRoute({
  status: Status.CREATED,
  middlewares: [verifyApiKey('ADMIN')],
  schemas: {
    body: z.object({
      employeeId: z.string(),
      dn: z.string(),
      givenName: z.string().optional(),
      fullName: z.string().optional(),
    }),
  },
  handler: async ({body, response}) => {
    const employeeRepository = db.getRepository(Employee);

    const employee = await employeeRepository.findOneBy({
      number: body.employeeId,
    });

    if (!employee) {
      await employeeRepository.save(
        new Employee({
          number: body.employeeId,
          dn: body.dn,
          fullName: body.fullName,
          givenName: body.givenName,
        })
      );
    } else {
      let isUpdated = false;
      if (employee.dn !== body.dn) {
        employee.changeDn(body.dn);
        isUpdated = true;
      }
      if (body.givenName && employee.givenName !== body.givenName) {
        employee.changeGivenName(body.givenName);
        isUpdated = true;
      }
      if (body.fullName && employee.fullName !== body.fullName) {
        employee.changeFullName(body.fullName);
        isUpdated = true;
      }

      if (isUpdated) {
        await employeeRepository.save(employee);
      }
    }

    const token = jwt.sign({sub: body.employeeId});

    return response({token});
  },
});
