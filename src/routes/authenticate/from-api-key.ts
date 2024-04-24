import {Employee} from '@/database/entities/employee';
import {Status} from '@/enum/status';
import {env} from '@/lib/env';
import {createRoute} from '@/lib/http';
import {jwt} from '@/lib/jwt';
import {db} from '@/lib/typeorm';
import {z} from 'zod';

export const authenticateFromApiKey = createRoute({
  status: Status.CREATED,
  schemas: {
    query: z.object({apiKey: z.literal(env.API_KEY)}),
    body: z.object({employeeId: z.string(), dn: z.string()}),
  },
  handler: async ({body, response}) => {
    const employeeRepository = db.getRepository(Employee);
    const employee = employeeRepository.findOneBy({number: body.employeeId});

    if (!employee) {
      await employeeRepository.save(
        new Employee({number: body.employeeId, dn: body.dn})
      );
    }

    const token = jwt.sign({sub: body.employeeId});

    return response({token});
  },
});
