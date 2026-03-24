import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteOptions } from '@/routing/route-options';
import { createLegacyRouteDecorator } from './legacy-router';

export interface Route {
  path: string;
  method: HttpMethod | HttpMethod[];
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}

export const Route = createLegacyRouteDecorator;
