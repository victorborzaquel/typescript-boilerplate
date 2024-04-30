import {Status} from '@/enum/status';
import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {Logger} from '../logger';
import {ResponseError} from './error';
import {
  RouteContext,
  RouteMiddlewareOptions,
  RouteOptions,
  RouteSchemas,
  SendResponse,
} from './interface';

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

export function createSchema<Body, Params, Query, Extra>(
  schemas: RouteSchemas<Body, Params, Query>
) {
  return schemas as RouteSchemas<Body, Params, Query> & Extra;
}

export function createMiddleware<Extra, Body, Params, Query>({
  handler,
  schemas = {},
}: RouteMiddlewareOptions<Body, Params, Query, Extra>) {
  return (context: RouteContext<Body, Params, Query, Extra>, req: Request) => {
    if (schemas.body) {
      context.body = {...schemas.body.parse(req.body), ...context.body};
    }
    if (schemas.params) {
      context.params = {...schemas.params.parse(req.params), ...context.params};
    }
    if (schemas.query) {
      context.query = {...schemas.query.parse(req.query), ...context.query};
    }
    return handler(context);
  };
}
/**
 * Create a route handler with middlewares and schemas validation
 */
export function createRoute<Extra, Body, Params, Query, Resp>({
  status = Status.OK,
  handler,
  middlewares = [],
  schemas = {},
}: RouteOptions<Body, Params, Query, Extra, Resp>) {
  return async (req: Request, resp: Response, _next: NextFunction) => {
    const regex = /(\?|&)secret=[^&\s]+/g;
    const subst = '$1secret={secret}';
    const path = req.url.replace(regex, subst);

    const logger = new Logger(path);
    try {
      logger.info(`Request: ${req.method} ${path}`);
      const context = {} as RouteContext<Body, Params, Query, Extra>;

      // context.response = createResponse(resp, status);
      context.headers = req.headers;
      // context.next = next;
      context.logger = logger;

      if (schemas.body) {
        context.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        context.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        context.query = schemas.query.parse(req.query);
      }

      for await (const middleware of middlewares) {
        await middleware(context, req);
      }

      const response = await handler(context);
      return createResponse(resp, status)(response);
    } catch (error) {
      logger.fromError(error);
      return handleError(createResponse(resp), error as Error);
    } finally {
      logger.info(`Response: ${req.method} ${path} ${resp.statusCode}`);
    }
  };
}
