import type { HttpMiddleware, HttpRequest } from '@/Http';
import { createRouteDefinition } from '@/routing/definition/create-route-definition';
import type { RouteDefinition } from '@/routing/definition/route-definition';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteOptions } from '@/routing/route-options';
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
