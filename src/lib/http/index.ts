import {Status} from '@/enum/status';
import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {ResponseError} from './error';
import {RouteContext, RouteOptions, SendResponse} from './interface';

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

export function createRoute<Extra, Body, Params, Query>({
  status = Status.OK,
  handler,
  middlewares = [],
  schemas = {},
}: RouteOptions<Body, Params, Query, Extra>) {
  return async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const context = {} as RouteContext<Body, Params, Query, Extra>;

      context.response = createResponse(resp, status);
      context.headers = req.headers;
      context.next = next;

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
        await middleware(context);
      }

      return await handler(context);
    } catch (error: unknown) {
      return handleError(createResponse(resp), error as Error);
    }
  };
}
