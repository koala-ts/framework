import type { HttpMiddleware } from '@/Http';
import type { RouteOptions } from '@/routing/declaration/route-options.type';
import type { HttpMethod } from '@/routing/http-method.type';
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
