import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteOptions } from '@/routing/route-options';
import { createRouteDefinition } from './create-route-definition';
import type { RouteDefinition } from './route-definition';

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
