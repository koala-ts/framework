import type { HttpMiddleware } from '@/Http';
import { createRouteDefinition } from '@/routing/definition/create-route-definition';
import type { RouteDefinition } from '@/routing/definition/route-definition';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteOptions } from '@/routing/route-options';

export interface RouteDeclaration {
  name?: string;
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: HttpMiddleware;
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}

export function Route(route: RouteDeclaration): RouteDefinition {
  return createRouteDefinition(route);
}
