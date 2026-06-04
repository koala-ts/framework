import type { HttpMiddleware } from '@/Http';
import type { RouteOptions } from '@/routing/declaration/route-options.type';
import type { RouterMethod } from '@/routing/declaration/router-method.type';

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
