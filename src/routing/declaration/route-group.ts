import type { HttpMiddleware, HttpRequest } from '@/Http';

import { RouteProps } from '@/routing/declaration/route-props.type';
import type { RouteSource } from '@/routing/registration/source/route-source';
import type { Request } from 'koa';

export type RouteConfigOverlay<TRequest extends Request = HttpRequest> = Pick<
  RouteProps<TRequest>,
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
