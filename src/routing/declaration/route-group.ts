import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '@/Http';

import { RouteProps } from '@/routing/declaration/route-props.type';
import type { RouteSource } from '@/routing/declaration/route-source.type';

export type RouteConfigOverlay<TRequest extends HttpRequestBase = HttpRequest> = Pick<
  RouteProps<TRequest>,
  'middleware' | 'options'
>;

export interface RouteGroupOptions<TRequest extends HttpRequestBase = HttpRequest> {
  prefix?: string;
  namePrefix?: string;
  middleware?: HttpMiddleware<TRequest>[];
  routeConfig?: Record<string, RouteConfigOverlay<TRequest>>;
}

export interface RouteGroupDefinition<TRequest extends HttpRequestBase = HttpRequest> {
  kind: 'route-group';
  options: RouteGroupOptions<TRequest>;
  resolveRoutes: () => RouteSource<TRequest>[];
}

export function RouteGroup<TRequest extends HttpRequestBase = HttpRequest>(
  options: RouteGroupOptions<TRequest>,
  resolveRoutes: () => RouteSource<TRequest>[],
): RouteGroupDefinition<TRequest> {
  return {
    kind: 'route-group',
    options,
    resolveRoutes,
  };
}
