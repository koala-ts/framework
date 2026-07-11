import type { HttpMiddleware } from '#koala/Http/index';
import type { RouteOptions } from '#koala/routing/declaration/route-options.type';
import type { RouterMethod } from '#koala/routing/declaration/router-method.type';

/**
 * @deprecated Legacy decorator routing metadata. Use `@koala-ts/framework/routing` instead.
 */
export interface RouteMetadata {
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  parseBody: boolean;
  middleware: HttpMiddleware[];
  bodyOptions: Partial<RouteOptions>;
}
