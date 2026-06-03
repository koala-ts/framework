import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { RouterMethod } from '@/routing/router-method.type';
import type { Request } from 'koa';
import type { KoaBodyMiddlewareOptions } from 'koa-body';

export interface RouteDefinition<TRequest extends Request = HttpRequest> {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware: HttpMiddleware<TRequest>[];
  parseBody: boolean;
  bodyOptions: Partial<KoaBodyMiddlewareOptions>;
}
