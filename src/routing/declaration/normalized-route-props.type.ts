import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '#koala/Http/index';
import type { RouteBodyOptions } from '#koala/routing/declaration/route-body-options.type';
import type { RouterMethod } from '#koala/routing/declaration/router-method.type';

export interface NormalizedRouteProps<TRequest extends HttpRequestBase = HttpRequest> {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware: HttpMiddleware<TRequest>[];
  parseBody: boolean;
  bodyOptions: RouteBodyOptions;
}
