import {Status} from '@/enum/status';
import {NextFunction} from 'express';
import {IncomingHttpHeaders} from 'node:http';
import {z} from 'zod';

export type SendResponse = (data: unknown, status?: number) => void;

export type MiddlewareContext<Extra> = RouteContext<
  unknown,
  unknown,
  unknown,
  Extra
>;

export type RouteContext<Body, Params, Query, Extra = NonNullable<unknown>> = {
  body: Body;
  params: Params;
  query: Query;
  headers: IncomingHttpHeaders;
  response: SendResponse;
  logger: unknown;
  next: NextFunction;
} & Extra;

export type RouteMiddleware<Context> = (context: Context) => Promise<void>;

export interface RouteOptions<Body, Params, Query, Extra> {
  status?: Status;
  handler: (context: RouteContext<Body, Params, Query, Extra>) => Promise<void>;
  schemas?: {
    body?: z.ZodSchema<Body>;
    params?: z.ZodSchema<Params>;
    query?: z.ZodSchema<Query>;
  };
  middlewares?: RouteMiddleware<RouteContext<Body, Params, Query, Extra>>[];
}
