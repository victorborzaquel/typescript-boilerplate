import {Status} from '@/enum/status';
import {NextFunction, Request, Response} from 'express';
import {createLogger, format, transports} from 'winston';
import {z} from 'zod';
import {env} from '../env';
import {ResponseError} from './error';
import {
  RouteContext,
  RouteMiddleware,
  RouteOptions,
  SendResponse,
} from './interface';

const logger = createLogger({
  format: format.combine(
    format.timestamp({format: 'DD/MM/YYYY HH:mm:ss'}),
    format.errors({stack: true}),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: 'logs/combined.log',
      level: 'info',
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});

if (env.isDevelopment) {
  logger.add(new transports.Console());
}

function createResponse(
  res: Response,
  defaultStatus: Status = Status.OK
): SendResponse {
  return (data: unknown, status = defaultStatus) => {
    res.status(status).json(data);
  };
}

function handleError(sendResponse: SendResponse, error: Error) {
  if (error instanceof z.ZodError) {
    return sendResponse(
      {error: 'Invalid data.', details: error.errors},
      Status.UNPROCESSABLE_ENTITY
    );
  }

  if (error instanceof ResponseError) {
    const {data, message, stack, status} = error;
    return sendResponse({error: message, data, stack}, status);
  }

  const {name, message, stack, cause} = error;
  const data = {name, message, stack, cause};
  return sendResponse(
    {error: 'Internal Server Error', data},
    Status.INTERNAL_SERVER_ERROR
  );
}

export function createMiddleware<Extra, Body, Params, Query>(
  middleware: RouteMiddleware<Body, Params, Query, Extra>
) {
  return middleware;
}
/**
 * Create a route handler with middlewares and schemas validation
 */
export function createRoute<Extra, Body, Params, Query>({
  status = Status.OK,
  handler,
  middlewares = [],
  schemas = {},
}: RouteOptions<Body, Params, Query, Extra>) {
  return async (req: Request, resp: Response, next: NextFunction) => {
    try {
      logger.info(`Request: ${req.method} ${req.url}`);
      const context = {} as RouteContext<Body, Params, Query, Extra>;

      context.response = createResponse(resp, status);
      context.headers = req.headers;
      context.next = next;
      context.logger = logger;

      // if (schemas.body) {
      const bodyParser = middlewares.reduce(
        (acc, curr) => {
          if (curr?.schemas?.body) {
            return acc.merge(curr.schemas.body);
          }
          return acc;
        },
        schemas?.body || z.object({})
      );

      // context.body = schemas.body.parse(req.body);
      context.body = bodyParser.parse(req.body);
      // }
      // if (schemas.params) {
      const paramsParser = middlewares.reduce(
        (acc, curr) => {
          if (curr?.schemas?.params) {
            return acc.merge(curr.schemas.params);
          }
          return acc;
        },
        (schemas?.params as any) || z.object({})
      );
      context.params = paramsParser.parse(req.params);
      // context.params = schemas.params.parse(req.params);
      // }
      // if (schemas.query) {
      const queryParser = middlewares.reduce(
        (acc, curr) => {
          if (curr?.schemas?.query) {
            return acc.merge(curr.schemas.query);
          }
          return acc;
        },
        (schemas?.query as any) || z.object({})
      );
      context.query = queryParser.parse(req.query);
      // context.query = schemas.query.parse(req.query);
      // }

      for await (const middleware of middlewares) {
        await middleware.handler(context);
      }

      return await handler(context);
    } catch (error) {
      logger.error(error);
      return handleError(createResponse(resp), error as Error);
    } finally {
      logger.info(`Response: ${req.method} ${req.url} ${resp.statusCode}`);
    }
  };
}
