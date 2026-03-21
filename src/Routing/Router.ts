import 'reflect-metadata';
import { type HttpScope } from '@/Http';
import { koaBody } from 'koa-body';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import Router, { type RouterInstance } from '@koa/router';
import type { HttpMethod, Route, RouteMetadata, RouteOptions, RouterMethod } from './types';
import type { HttpMiddleware } from '@/Http';

const key = Symbol('Route');

export function Route({ method, path, middleware = [], options = {} }: Route): MethodDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const routes: RouteMetadata[] = getRoutes();

    routes.push({
      path,
      methods: qualifyMethod(method),
      handler: qualifyHandler(target, propertyKey),
      parseBody: options.parseBody ?? true,
      middleware,
      bodyOptions: extractBodyOptions(options),
    });

    Reflect.defineMetadata(key, routes, Reflect);
  };
}

export function getRoutes(): RouteMetadata[] {
  return (Reflect.getMetadata(key, Reflect) ?? []) as RouteMetadata[];
}

export const registerRoutes: Middleware<DefaultState, DefaultContext & HttpScope> = async (context, next) => {
  const router = createRouter();
  const dispatch = router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>;
  const handleAllowedMethods = router.allowedMethods() as unknown as Middleware<
    DefaultState,
    DefaultContext & HttpScope
  >;

  await dispatch(context, async () => {
    await handleAllowedMethods(context, next);
  });
};

function qualifyMethod(method: HttpMethod | HttpMethod[]): RouterMethod[] {
  const methods = Array.isArray(method) ? method : [method];
  const result: RouterMethod[] = [];

  for (const method of methods) {
    const lower = method.toLowerCase() as RouterMethod;
    const methodName = ['any', 'all'].includes(lower) ? 'all' : lower;
    result.push(methodName);
  }

  return result;
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

function createRouter(): RouterInstance {
  const router = new Router();

  for (const route of normalizeRoutes(getRoutes())) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
}

function normalizeRoutes(routes: ReturnType<typeof getRoutes>): RouteRegistration[] {
  const registrations: RouteRegistration[] = [];

  for (const route of routes) {
    const middleware = resolveRouteMiddleware(route);

    for (const method of route.methods) {
      registrations.push({
        method,
        path: route.path,
        middleware,
      });
    }
  }

  return registrations;
}

function resolveRouteMiddleware(route: ReturnType<typeof getRoutes>[number]): RouteRegistration['middleware'] {
  const middlewareStack = [...route.middleware, route.handler];

  return route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
}

interface RouteRegistration {
  method: RouterMethod;
  path: string;
  middleware: Array<RouteMetadata['middleware'][number] | RouteMetadata['handler']>;
}
