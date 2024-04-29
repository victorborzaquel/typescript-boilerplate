import {Status} from '@/enum/status';
import {NextFunction} from 'express';
import {IncomingHttpHeaders} from 'node:http';
import {Logger} from 'winston';
import {z} from 'zod';

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
  response: SendResponse;
  logger: Logger;
  next: NextFunction;
} & Extra;

// export type RouteMiddleware<Context> = (context: Context) => Promise<void>;

export interface RouteMiddleware<Body, Params, Query> {
  handler: (context: RouteContext<Body, Params, Query, Extra>) => Promise<void>;
  schemas?: RouteSchemas<Body, Params, Query>;
}

export interface RouteSchemas<Body, Params, Query> {
  body?: z.ZodSchema<Body>;
  params?: z.ZodSchema<Params>;
  query?: z.ZodSchema<Query>;
}

export interface RouteOptions<Body, Params, Query, Extra> {
  status?: Status;
  handler: (context: RouteContext<Body, Params, Query, Extra>) => Promise<void>;
  schemas?: RouteSchemas<Body, Params, Query>;
  middlewares?: RouteMiddleware<Body, Params, Query>[];
}
