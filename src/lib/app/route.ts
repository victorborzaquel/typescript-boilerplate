import {Status} from '@/enum/status';
import {AppError} from '@/errors/@app-error';
import {Request, Response} from 'express';
import {z} from 'zod';

type SendResponse = (data: unknown, status?: number) => void;

function createResponse(res: Response): SendResponse {
  return (data: unknown, status = Status.OK) => {
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

  if (error instanceof AppError) {
    return sendResponse(
      {error: error.message, data: error.data, stack: error.stack},
      error.status
    );
  }

  return sendResponse(
    {
      error: 'Internal Server Error',
      data: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    },
    Status.INTERNAL_SERVER_ERROR
  );
}

export type ApiHandlerContext<Body, Params, Query> = {
  body?: Body;
  params?: Params;
  query?: Query;
  response?: SendResponse;
};

export type ApiMiddleware<TContext> = (
  req: Request,
  context: TContext
) => Promise<void>;

export interface ApiHandlerOptions<Body, Params, Query> {
  handler: (
    context: ApiHandlerContext<Body, Params, Query>,
    req: Request
  ) => Promise<void>;
  schemas?: {
    body?: z.ZodSchema<Body>;
    params?: z.ZodSchema<Params>;
    query?: z.ZodSchema<Query>;
  };
  middlewares?: ApiMiddleware<ApiHandlerContext<Body, Params, Query>>[];
}

export function createRoute<Body, Params, Query>({
  handler,
  middlewares = [],
  schemas,
}: ApiHandlerOptions<Body, Params, Query>) {
  return async (req: Request, resp: Response) => {
    const sendResponse = createResponse(resp);
    try {
      const context = {} as ApiHandlerContext<
        z.infer<typeof schemas.body>,
        z.infer<typeof schemas.params>,
        z.infer<typeof schemas.query>
      >;

      context.response = sendResponse;

      if (schemas?.body) {
        context.body = schemas.body.parse(req.body);
      }
      if (schemas?.params) {
        context.params = schemas.params.parse(req.params);
      }
      if (schemas?.query) {
        context.query = schemas.query.parse(req.query);
      }

      for await (const middleware of middlewares) {
        await middleware(req, context);
      }

      return await handler(context, req);
    } catch (error: unknown) {
      return handleError(sendResponse, error as Error);
    }
  };
}
