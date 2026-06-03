import type { HttpMiddleware, HttpRequest } from '@/Http';
import { createRouteDefinition } from '@/routing/route/create-route-definition';
import type { RouteDefinition } from '@/routing/route/route-definition.type';
import type { RouteOptions } from '@/routing/route/route-options.type';
import type { HttpMethod } from '@/routing/verb/http-method.type';
import type { Request } from 'koa';

export interface RouteDeclaration<TRequest extends Request = HttpRequest> {
  name?: string;
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}

export function Route<TRequest extends Request = HttpRequest>(
  route: RouteDeclaration<TRequest>,
): RouteDefinition<TRequest> {
  return createRouteDefinition(route);
}
