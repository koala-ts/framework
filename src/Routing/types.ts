import type { KoaBodyMiddlewareOptions } from 'koa-body';
import type { HttpMiddleware } from '@/Http';

export type HttpMethod =
  | 'get' | 'post' | 'put' | 'patch' | 'delete'
  | 'options' | 'head' | 'any' | 'all'
  | 'GET' | 'POST' | 'PUT' | 'PATCH'
  | 'DELETE' | 'OPTIONS' | 'HEAD'
  | 'ANY' | 'ALL';

export type RouterMethod =
  | 'get' | 'post' | 'put' | 'patch'
  | 'delete' | 'options' | 'head'
  | 'all';

export interface RouteMetadata {
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  parseBody: boolean;
  middleware: HttpMiddleware[];
  bodyOptions: Partial<RouteOptions>;
}

export type RouteOptions = Partial<KoaBodyMiddlewareOptions & {
  parseBody?: boolean;
}>;

export interface Route {
  path: string;
  method: HttpMethod | HttpMethod[];
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}
