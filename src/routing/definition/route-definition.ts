import type { HttpRequest, HttpScope, NextMiddleware } from '@/Http';
import type { RouterMethod } from '@/routing/router-method';
import type { Request } from 'koa';
import type { KoaBodyMiddlewareOptions } from 'koa-body';

type RouteDefinitionMiddleware<TRequest extends Request = HttpRequest> = {
  handle(scope: HttpScope<TRequest>, next: NextMiddleware): Promise<unknown>;
}['handle'];

export interface RouteDefinition<TRequest extends Request = HttpRequest> {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: RouteDefinitionMiddleware<TRequest>;
  middleware: RouteDefinitionMiddleware<TRequest>[];
  parseBody: boolean;
  bodyOptions: Partial<KoaBodyMiddlewareOptions>;
}
