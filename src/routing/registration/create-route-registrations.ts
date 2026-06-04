import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteRegistration } from '@/routing/registration/route-registration';
import type { Request } from 'koa';
import { koaBody } from 'koa-body';

export function createRouteRegistrations<TRequest extends Request>(
  routes: NormalizedRouteProps<TRequest>[],
): RouteRegistration<TRequest>[] {
  const registrations: RouteRegistration<TRequest>[] = [];

  for (const route of routes) {
    registrations.push(...createRouteRegistration(route));
  }

  return registrations;
}

function createRouteRegistration<TRequest extends Request>(
  route: NormalizedRouteProps<TRequest>,
): RouteRegistration<TRequest>[] {
  const middleware = resolveRouteMiddleware(route);

  return route.methods.map(method => ({
    method,
    path: route.path,
    middleware,
  }));
}

function resolveRouteMiddleware<TRequest extends Request>(
  route: NormalizedRouteProps<TRequest>,
): RouteRegistration<TRequest>['middleware'] {
  const middlewareStack = [...route.middleware, route.handler];

  return route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
}
