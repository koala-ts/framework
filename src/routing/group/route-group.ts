import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { RouteSource } from '@/routing/registration/source/route-source';

import { RouteDeclaration } from '@/routing/route/route-declaration.type';
import type { Request } from 'koa';

export type RouteConfigOverlay<TRequest extends Request = HttpRequest> = Pick<
  RouteDeclaration<TRequest>,
  'middleware' | 'options'
>;

export interface RouteGroupOptions<TRequest extends Request = HttpRequest> {
  prefix?: string;
  namePrefix?: string;
  middleware?: HttpMiddleware<TRequest>[];
  routeConfig?: Record<string, RouteConfigOverlay<TRequest>>;
}

export interface RouteGroupDefinition<TRequest extends Request = HttpRequest> {
  kind: 'route-group';
  options: RouteGroupOptions<TRequest>;
  resolveRoutes: () => RouteSource<TRequest>[];
}

export function RouteGroup<TRequest extends Request = HttpRequest>(
  options: RouteGroupOptions<TRequest>,
  resolveRoutes: () => RouteSource<TRequest>[],
): RouteGroupDefinition<TRequest> {
  return {
    kind: 'route-group',
    options,
    resolveRoutes,
  };
}
