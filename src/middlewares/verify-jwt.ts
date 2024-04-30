import {Status} from '@/enum/status';
import {createMiddleware} from '@/lib/http';
import {ResponseError} from '@/lib/http/error';
import {MiddlewareContext} from '@/lib/http/interface';
import {JwtProvider} from '@/lib/jwt';
import {db} from '@/lib/typeorm';
import {Employee} from '@/lib/typeorm/entities/employee';

interface Auth {
  employee: Employee;
}

/**
 * Middleware to verify JWT token from Authorization header and set employee in context
 */
export const verifyJWT = createMiddleware({
  handler: async function verifyJWT(
    context: MiddlewareContext<Auth>
  ): Promise<void> {
    const employeeRepository = db.getRepository(Employee);
    const jwt = new JwtProvider();

    function extractPayload(jwt: JwtProvider, token?: string) {
      if (!token) {
        throw new ResponseError({
          message: 'Authorization token is missing',
          status: Status.UNAUTHORIZED,
        });
      }
      try {
        const payload = jwt.verify(token);
        return payload;
      } catch (error) {
        throw new ResponseError({
          message: 'Authorization token is invalid',
          status: Status.UNAUTHORIZED,
        });
      }
    }

    const token = context.headers.authorization?.split(' ')?.[1];
    const payload = extractPayload(jwt, token);

    const employee = await employeeRepository.findOneBy({number: payload.sub});

    if (!employee) {
      throw new ResponseError({
        message: 'Employee not found',
        status: Status.NOT_FOUND,
      });
    }

    context.employee = employee;
  },
});
