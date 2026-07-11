import { koaBody } from 'koa-body';
import type { HttpRequestBase } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteRegistration } from '@/routing/registration/route-registration';

export function createRouteRegistrations<TRequest extends HttpRequestBase>(
  routes: NormalizedRouteProps<TRequest>[],
): RouteRegistration<TRequest>[] {
  const registrations: RouteRegistration<TRequest>[] = [];

  for (const route of routes) {
    registrations.push(...createRouteRegistration(route));
  }

  return registrations;
}

function createRouteRegistration<TRequest extends HttpRequestBase>(
  route: NormalizedRouteProps<TRequest>,
): RouteRegistration<TRequest>[] {
  const middleware = resolveRouteMiddleware(route);

  return route.methods.map(method => ({
    method,
    path: route.path,
    middleware,
  }));
}

function resolveRouteMiddleware<TRequest extends HttpRequestBase>(
  route: NormalizedRouteProps<TRequest>,
): RouteRegistration<TRequest>['middleware'] {
  const middlewareStack = [...route.middleware, route.handler];

  return route.parseBody
    ? [koaBody(route.bodyOptions as Parameters<typeof koaBody>[0]), ...middlewareStack]
    : middlewareStack;
}
