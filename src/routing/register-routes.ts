import { type Application } from '@/application/application';
import { type HttpScope } from '@/Http';
import type { RouteDefinition } from '@/routing/route-definition';
import type { RouterMethod } from '@/routing/router-method';
import { koaBody } from 'koa-body';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import Router, { type RouterInstance } from '@koa/router';

interface RouteRegistration {
  method: RouterMethod;
  path: string;
  middleware: Array<RouteDefinition['middleware'][number] | RouteDefinition['handler']>;
}

export function registerRoutes(app: Application, routes: RouteDefinition[] = []): Application {
  const router = createRouter(routes);

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
}

function createRouter(routes: RouteDefinition[]): RouterInstance {
  const router = new Router();

  for (const route of expandRouteDefinitions(routes)) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
}

function expandRouteDefinitions(routes: RouteDefinition[]): RouteRegistration[] {
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
