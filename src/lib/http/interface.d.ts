import {Status} from '@/enum/status';
import {Request} from 'express';
import {IncomingHttpHeaders} from 'node:http';
import {z} from 'zod';
import {Logger} from '../logger';

export type SendResponse = (data: unknown, status?: number) => void;

export type MiddlewareContext<
  Extra,
  Body = unknown,
  Params = unknown,
  Query = unknown,
> = RouteContext<Body, Params, Query, Extra>;

export type RouteContext<Body, Params, Query, Extra = NonNullable<unknown>> = {
  body: Body;
  params: Params;
  query: Query;
  headers: IncomingHttpHeaders;
  // response: SendResponse;
  logger: Logger;
  // next: NextFunction;
} & Extra;

// export type RouteMiddleware<Context> = (context: Context) => Promise<void>;

export interface RouteMiddlewareOptions<Body, Params, Query, Extra> {
  handler: (context: MiddlewareContext<Extra>) => Promise<void>;
  schemas?: RouteSchemas<Body, Params, Query>;
}

export type RouteMiddleware<Context> = (
  context: Context,
  req: Request
) => Promise<void> | void;

export interface RouteSchemas<Body, Params, Query> {
  body?: z.ZodSchema<Body>;
  params?: z.ZodSchema<Params>;
  query?: z.ZodSchema<Query>;
}

export interface RouteOptions<Body, Params, Query, Extra, Resp> {
  status?: Status;
  handler: (
    context: RouteContext<Body, Params, Query, Extra>
  ) => Promise<Resp> | Resp;
  schemas?: RouteSchemas<Body, Params, Query>;
  middlewares?: RouteMiddleware<RouteContext<Body, Params, Query, Extra>>[];
}
