import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { RouteDeclaration } from '@/routing/route';
import type { RouteSource } from '@/routing/source/route-source';
import type { Request } from 'koa';

export type RouteConfigOverlay = Pick<RouteDeclaration, 'middleware' | 'options'>;

export interface RouteGroupOptions<TRequest extends Request = HttpRequest> {
  prefix?: string;
  namePrefix?: string;
  middleware?: HttpMiddleware<TRequest>[];
  routeConfig?: Record<string, RouteConfigOverlay>;
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
