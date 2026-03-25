import type { HttpMiddleware } from '@/Http';
import type { RouteDeclaration } from '@/routing/route';
import type { RouteSource } from '@/routing/route-source';

export type RouteConfigOverlay = Pick<RouteDeclaration, 'middleware' | 'options'>;

export interface RouteGroupOptions {
  prefix?: string;
  namePrefix?: string;
  middleware?: HttpMiddleware[];
  routeConfig?: Record<string, RouteConfigOverlay>;
}

export interface RouteGroupDefinition {
  kind: 'route-group';
  options: RouteGroupOptions;
  resolveRoutes: () => RouteSource[];
}

export function RouteGroup(options: RouteGroupOptions, resolveRoutes: () => RouteSource[]): RouteGroupDefinition {
  return {
    kind: 'route-group',
    options,
    resolveRoutes,
  };
}
