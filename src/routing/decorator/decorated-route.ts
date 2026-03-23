import type { HttpMiddleware } from '@/Http';
import type { RouteDefinition } from '@/routing/route-definition';
import type { HttpMethod } from './http-method';
import type { RouteOptions } from './route-options';
import type { Route } from './route';
import type { RouterMethod } from './router-method';

const routeMetadataKey = Symbol.for('@koala-ts/framework/route-metadata');
const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

interface AttachedRouteMetadata {
  path: string;
  methods: RouterMethod[];
  parseBody: boolean;
  middleware: HttpMiddleware[];
  bodyOptions: RouteDefinition['bodyOptions'];
}

type DecoratedRouteHandler = HttpMiddleware & {
  [routeMetadataKey]?: AttachedRouteMetadata[];
};

type RouteGlobal = typeof globalThis & {
  [routeRegistryKey]?: Set<HttpMiddleware>;
};

export function attachRouteToTarget(route: Route, target: unknown, propertyKey?: string | symbol): HttpMiddleware {
  const handler = resolveRouteHandler(target, propertyKey);

  if (handler === undefined) {
    throw new TypeError('Route decorator can only be applied to functions or methods.');
  }

  return attachRouteMetadata(handler, route);
}

export function getRegisteredRouteDefinitions(): RouteDefinition[] {
  const routes: RouteDefinition[] = [];

  for (const handler of getRegisteredHandlers()) {
    routes.push(...getRouteDefinitionsFromHandler(handler));
  }

  return routes;
}

export function getRouteDefinitionsFromHandler(handler: unknown, source?: string): RouteDefinition[] {
  if (typeof handler !== 'function') {
    return [];
  }

  const routeHandler = handler as HttpMiddleware;
  const attachedRoutes = getAttachedRouteMetadata(handler);

  return attachedRoutes.map(route => ({
    ...route,
    handler: routeHandler,
    source,
  }));
}

export function hasAttachedRouteMetadata(handler: unknown): handler is HttpMiddleware {
  return getAttachedRouteMetadata(handler).length > 0;
}

function attachRouteMetadata(handler: HttpMiddleware, route: Route): HttpMiddleware {
  const decoratedHandler = handler as DecoratedRouteHandler;

  decoratedHandler[routeMetadataKey] = [...getAttachedRouteMetadata(handler), createAttachedRouteMetadata(route)];
  getRegisteredHandlers().add(handler);

  return handler;
}

function getAttachedRouteMetadata(handler: unknown): AttachedRouteMetadata[] {
  if (typeof handler !== 'function') {
    return [];
  }

  const decoratedHandler = handler as DecoratedRouteHandler;

  return decoratedHandler[routeMetadataKey] ?? [];
}

function getRegisteredHandlers(): Set<HttpMiddleware> {
  const routeGlobal = globalThis as RouteGlobal;

  routeGlobal[routeRegistryKey] ??= new Set<HttpMiddleware>();

  return routeGlobal[routeRegistryKey];
}

function createAttachedRouteMetadata({ method, path, middleware = [], options = {} }: Route): AttachedRouteMetadata {
  const parseBody = options.parseBody === undefined ? true : options.parseBody;

  return {
    path,
    methods: qualifyMethod(method),
    parseBody,
    middleware,
    bodyOptions: extractBodyOptions(options),
  };
}

function qualifyMethod(method: HttpMethod | HttpMethod[]): RouterMethod[] {
  const methods = Array.isArray(method) ? method : createMethodList(method);

  return methods.map(currentMethod => {
    const normalizedMethod = currentMethod.toLowerCase() as RouterMethod;

    return ['any', 'all'].includes(normalizedMethod) ? 'all' : normalizedMethod;
  });
}

function createMethodList(method: HttpMethod): HttpMethod[] {
  return [method];
}

function extractBodyOptions(options: RouteOptions): RouteDefinition['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as RouteDefinition['bodyOptions'];
}

function resolveRouteHandler(target: unknown, propertyKey?: string | symbol): HttpMiddleware | undefined {
  if (propertyKey === undefined || target === null || target === undefined) {
    return typeof target === 'function' ? (target as HttpMiddleware) : undefined;
  }

  const candidate = (target as Record<PropertyKey, unknown>)[propertyKey];

  return typeof candidate === 'function' ? (candidate as HttpMiddleware) : undefined;
}
