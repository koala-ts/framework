import { type Application } from '@/application/application';
import { type HttpMiddleware } from '@/Http';
import { createRouteDefinition } from '@/routing/route/definition/create-route-definition';
import type { RouteDefinition } from '@/routing/route/definition/route-definition.type';
import { registerRoutes } from '@/routing/route/registration/register-routes';
import 'reflect-metadata';
import type { Route } from './route';
import type { RouteMetadata } from './route-metadata';

const legacyRouteMetadataKey = Symbol('Route');

export function createLegacyRouteDecorator({ method, path, middleware = [], options = {} }: Route): MethodDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const routes = getLegacyRoutes();

    routes.push(createRouteMetadata({ method, path, middleware, options }, target, propertyKey));

    storeLegacyRoutes(routes);
  };
}

export function getLegacyRoutes(): RouteMetadata[] {
  return (Reflect.getMetadata(legacyRouteMetadataKey, Reflect) ?? []) as RouteMetadata[];
}

export function getLegacyRouteDefinitions(): RouteDefinition[] {
  return getLegacyRoutes().map(route =>
    createRouteDefinition({
      method: route.methods,
      path: route.path,
      handler: route.handler,
      middleware: route.middleware,
      options: {
        ...route.bodyOptions,
        parseBody: route.parseBody,
      },
    }),
  );
}

export function registerLegacyRoutes(app: Application): Application {
  return registerRoutes(app, getLegacyRouteDefinitions());
}

function storeLegacyRoutes(routes: RouteMetadata[]): void {
  Reflect.defineMetadata(legacyRouteMetadataKey, routes, Reflect);
}

function createRouteMetadata(
  {
    method,
    path,
    middleware,
    options,
  }: Pick<Route, 'method' | 'path'> & {
    middleware: NonNullable<Route['middleware']>;
    options: NonNullable<Route['options']>;
  },
  target: object,
  propertyKey: string | symbol,
): RouteMetadata {
  const routeDefinition = createRouteDefinition({
    method,
    path,
    handler: qualifyHandler(target, propertyKey),
    middleware,
    options,
  });

  return {
    path: routeDefinition.path,
    methods: routeDefinition.methods,
    handler: routeDefinition.handler,
    parseBody: routeDefinition.parseBody,
    middleware: routeDefinition.middleware,
    bodyOptions: routeDefinition.bodyOptions,
  };
}

function qualifyHandler(target: unknown, propertyKey: string | symbol): HttpMiddleware {
  if (typeof target === 'function') {
    return target as HttpMiddleware;
  }

  return (target as never)[propertyKey] as HttpMiddleware;
}
