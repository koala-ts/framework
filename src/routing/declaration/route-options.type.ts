import type { KoaBodyMiddlewareOptions } from 'koa-body';

export type RouteOptions = Partial<
  KoaBodyMiddlewareOptions & {
    parseBody?: boolean;
  }
>;
