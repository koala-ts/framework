import type { HttpRequest } from '@/Http';
import { createRouteDefinition } from '@/routing/route/create-route-definition';
import { RouteDeclaration } from '@/routing/route/route-declaration.type';
import type { RouteDefinition } from '@/routing/route/route-definition.type';
import type { Request } from 'koa';

export function Route<TRequest extends Request = HttpRequest>(
  route: RouteDeclaration<TRequest>,
): RouteDefinition<TRequest> {
  return createRouteDefinition(route);
}
