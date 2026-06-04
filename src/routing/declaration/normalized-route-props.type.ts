import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { RouteBodyOptions } from '@/routing/declaration/route-body-options.type';
import type { RouterMethod } from '@/routing/declaration/router-method.type';
import type { Request } from 'koa';

export interface NormalizedRouteProps<TRequest extends Request = HttpRequest> {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware: HttpMiddleware<TRequest>[];
  parseBody: boolean;
  bodyOptions: RouteBodyOptions;
}
