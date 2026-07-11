import type { Application } from '#koala/application/application';
import type { HttpMiddleware } from '#koala/Http/index';
import type { NormalizedRouteProps } from '#koala/routing/declaration/normalized-route-props.type';
import { Route as createRouteDefinition } from '#koala/routing/index';
import { registerRoutes } from '#koala/routing/registration/register-routes';
import 'reflect-metadata';
import type { Route } from '#koala/routing/deprecated-decorator/route';
import type { RouteMetadata } from '#koala/routing/deprecated-decorator/route-metadata';

const legacyRouteMetadataKey = Symbol('Route');

export function createLegacyRouteDecorator({ method, path, middleware = [], options = {} }: Route): MethodDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const routes = getLegacyRoutes();

    routes.push(createRouteMetadata({ method, path, middleware, options }, target, propertyKey));

    storeLegacyRoutes(routes);
  };
}

export function getLegacyRoutes(): RouteMetadata[] {
  return (Reflect.getMetadata(legacyRouteMetadataKey, Reflect) ?? []) as RouteMetadata[];
}

export function getLegacyRouteDefinitions(): NormalizedRouteProps[] {
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
