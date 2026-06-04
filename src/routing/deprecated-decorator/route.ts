import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/declaration/http-method.type';
import type { RouteOptions } from '@/routing/declaration/route-options.type';
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
