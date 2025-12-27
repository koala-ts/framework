import 'reflect-metadata';
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
