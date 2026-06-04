import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '@/Http';
import type { RouteBodyOptions } from '@/routing/declaration/route-body-options.type';
import type { RouterMethod } from '@/routing/declaration/router-method.type';

export interface NormalizedRouteProps<TRequest extends HttpRequestBase = HttpRequest> {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware: HttpMiddleware<TRequest>[];
  parseBody: boolean;
  bodyOptions: RouteBodyOptions;
}
