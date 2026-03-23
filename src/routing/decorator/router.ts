import { type Application } from '@/application/application';
import type { KoalaConfig } from '@/Config';
import { type HttpMiddleware, type HttpScope } from '@/Http';
import { attachRouteToTarget, getRegisteredRouteDefinitions } from '@/routing/decorator/decorated-route';
import { resolveConfiguredRoutes } from '@/routing/resolve-routes';
import { koaBody } from 'koa-body';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import Router, { type RouterInstance } from '@koa/router';
import type { Route } from './route';
import type { RouteMetadata } from './route-metadata';
import type { RouterMethod } from './router-method';

interface RouteRegistration {
  method: RouterMethod;
  path: string;
  middleware: Array<RouteMetadata['middleware'][number] | RouteMetadata['handler']>;
}

type RouteDecorator = MethodDecorator & (<T extends HttpMiddleware>(handler: T) => T);

export function createRouteDecorator(route: Route): RouteDecorator {
  const decorateRoute = <T extends HttpMiddleware>(target: object | T, propertyKey?: string | symbol): void | T => {
    const isMethodDecoratorTarget = isMethodTarget(target, propertyKey);
    const handler = attachRouteToTarget(route, target, propertyKey);

    if (isMethodDecoratorTarget) {
      return;
    }

    return handler as T;
  };

  return decorateRoute as RouteDecorator;
}

export function getRoutes(): RouteMetadata[] {
  return getRegisteredRouteDefinitions();
}

export function registerRoutes(app: Application, routes: RouteMetadata[] = getRoutes()): Application {
  return registerRouteMetadata(app, routes);
}

export function registerRouteDefinitions(app: Application, routes: RouteMetadata[]): Application {
  return registerRouteMetadata(app, routes);
}

export function registerRouteMetadata(app: Application, routes: RouteMetadata[]): Application {
  const router = createRouter(routes);

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
}

export function registerConfiguredRoutes(app: Application, config: KoalaConfig): Application {
  return registerRouteMetadata(app, resolveConfiguredRoutes(config));
}

function createRouter(routes: RouteMetadata[]): RouterInstance {
  const router = new Router();

  for (const route of normalizeRoutes(routes)) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
}

function normalizeRoutes(routes: RouteMetadata[]): RouteRegistration[] {
  const registrations: RouteRegistration[] = [];

  for (const route of routes) {
    registrations.push(...normalizeRoute(route));
  }

  return registrations;
}

function normalizeRoute(route: RouteMetadata): RouteRegistration[] {
  const middleware = resolveRouteMiddleware(route);

  return route.methods.map(method => ({
    method,
    path: route.path,
    middleware,
  }));
}

function resolveRouteMiddleware(route: RouteMetadata): RouteRegistration['middleware'] {
  const middlewareStack = [...route.middleware, route.handler];

  return route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
}

function isMethodTarget(target: object | HttpMiddleware, propertyKey?: string | symbol): boolean {
  if (propertyKey === undefined || target === null || target === undefined) {
    return false;
  }

  return typeof (target as Record<PropertyKey, unknown>)[propertyKey] === 'function';
}
