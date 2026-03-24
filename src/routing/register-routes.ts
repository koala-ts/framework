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
  const registrations = expandRouteDefinitions(routes);

  validateUniqueRouteNames(routes);
  validateUniqueRouteSignatures(registrations);

  for (const route of registrations) {
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

function validateUniqueRouteSignatures(registrations: RouteRegistration[]): void {
  const signatures = new Set<string>();

  for (const registration of registrations) {
    const signature = `${registration.method} ${registration.path}`;

    if (signatures.has(signature)) {
      throw new Error(`Duplicate route signature detected: ${registration.method.toUpperCase()} ${registration.path}.`);
    }

    signatures.add(signature);
  }
}

function validateUniqueRouteNames(routes: RouteDefinition[]): void {
  const routeNames = new Set<string>();

  for (const route of routes) {
    if (route.name === undefined) {
      continue;
    }

    if (routeNames.has(route.name)) {
      throw new Error(`Duplicate route name detected: ${route.name}.`);
    }

    routeNames.add(route.name);
  }
}
