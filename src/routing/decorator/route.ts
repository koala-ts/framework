import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from './http-method';
import type { RouteOptions } from './route-options';
import { createRouteDecorator } from './router';

export interface Route {
  path: string;
  method: HttpMethod | HttpMethod[];
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}

export const Route = createRouteDecorator;
