import 'reflect-metadata';
import { type Application } from '@/application/application';
import { type HttpMiddleware, type HttpScope } from '@/Http';
import { koaBody } from 'koa-body';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import Router, { type RouterInstance } from '@koa/router';
import type { HttpMethod } from './http-method';
import type { Route } from './route';
import type { RouteMetadata } from './route-metadata';
import type { RouteOptions } from './route-options';
import type { RouterMethod } from './router-method';

const routeMetadataKey = Symbol('Route');

interface RouteRegistration {
  method: RouterMethod;
  path: string;
  middleware: Array<RouteMetadata['middleware'][number] | RouteMetadata['handler']>;
}

export function createRouteDecorator({ method, path, middleware = [], options = {} }: Route): MethodDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    storeRoutes([...getRoutes(), createRouteMetadata({ method, path, middleware, options }, target, propertyKey)]);
  };
}

export function getRoutes(): RouteMetadata[] {
  return (Reflect.getMetadata(routeMetadataKey, Reflect) ?? []) as RouteMetadata[];
}

export function registerRoutes(app: Application): Application {
  const router = createRouter(getRoutes());

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
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

function storeRoutes(routes: RouteMetadata[]): void {
  Reflect.defineMetadata(routeMetadataKey, routes, Reflect);
}

function createRouteMetadata(
  { method, path, middleware, options }: Pick<Route, 'method' | 'path' | 'middleware' | 'options'>,
  target: object,
  propertyKey: string | symbol,
): RouteMetadata {
  return {
    path,
    methods: qualifyMethod(method),
    handler: qualifyHandler(target, propertyKey),
    parseBody: options?.parseBody ?? true,
    middleware: middleware ?? [],
    bodyOptions: extractBodyOptions(options ?? {}),
  };
}

function qualifyMethod(method: HttpMethod | HttpMethod[]): RouterMethod[] {
  const methods = Array.isArray(method) ? method : [method];

  return methods.map(method => {
    const lower = method.toLowerCase() as RouterMethod;

    return ['any', 'all'].includes(lower) ? 'all' : lower;
  });
}

function qualifyHandler(target: unknown, propertyKey: string | symbol): HttpMiddleware {
  if (typeof target === 'function') {
    return target as HttpMiddleware;
  }

  return (target as never)[propertyKey] as HttpMiddleware;
}

function extractBodyOptions(options: RouteOptions): RouteMetadata['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as RouteMetadata['bodyOptions'];
}
