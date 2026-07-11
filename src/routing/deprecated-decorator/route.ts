import type { HttpMiddleware } from '#koala/Http/index';
import type { RouteOptions } from '#koala/routing/declaration/route-options.type';
import { createLegacyRouteDecorator } from '#koala/routing/deprecated-decorator/legacy-router';
import type { HttpMethod } from '#koala/routing/http-method.type';

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
