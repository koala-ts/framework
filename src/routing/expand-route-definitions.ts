import { koaBody } from 'koa-body';
import type { RouteDefinition } from '@/routing/route-definition';
import type { RouteRegistration } from '@/routing/route-registration';

export function expandRouteDefinitions(routes: RouteDefinition[]): RouteRegistration[] {
  const registrations: RouteRegistration[] = [];

  for (const route of routes) {
    registrations.push(...expandRouteDefinition(route));
  }

  return registrations;
}

function expandRouteDefinition(route: RouteDefinition): RouteRegistration[] {
  const middleware = resolveRouteMiddleware(route);

  return route.methods.map(method => ({
    method,
    path: route.path,
    middleware,
  }));
}

function resolveRouteMiddleware(route: RouteDefinition): RouteRegistration['middleware'] {
  const middlewareStack = [...route.middleware, route.handler];

  return route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
}
