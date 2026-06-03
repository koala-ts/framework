import type { HttpMiddleware } from '@/Http';
import type { RouteOptions } from '@/routing/route/route-options';
import type { HttpMethod } from '@/routing/verb/http-method.type';
import { createLegacyRouteDecorator } from './legacy-router';

/**
 * @deprecated Use `Route` from `@koala-ts/framework/routing` for function-first route declarations.
 */
export interface Route {
  path: string;
  method: HttpMethod | HttpMethod[];
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}

/**
 * @deprecated Use `Route` from `@koala-ts/framework/routing` for function-first route declarations.
 */
export const Route = createLegacyRouteDecorator;
