import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteDefinition } from '@/routing/definition/route-definition';
import { Route } from '@/routing/route';

type RouteHandler = HttpMiddleware;
type MiddlewareAndHandler = [...middleware: HttpMiddleware[], handler: RouteHandler];
type NamedMiddlewareAndHandler = [name: string, ...middlewareAndHandler: MiddlewareAndHandler];
type VerbHelperRouteArguments = MiddlewareAndHandler | NamedMiddlewareAndHandler;
type UnsafeVerbHelperRouteArguments = VerbHelperRouteArguments | [name: string] | [];

interface VerbHelperArguments {
  path: string;
  name?: string;
  middleware: HttpMiddleware[];
  handler: RouteHandler;
}

type NamedVerbHelper = {
  (path: string, ...middlewareAndHandler: MiddlewareAndHandler): RouteDefinition;
  (path: string, name: string, ...middlewareAndHandler: MiddlewareAndHandler): RouteDefinition;
};

function createVerbHelper(method: HttpMethod): NamedVerbHelper {
  return (path: string, ...routeArguments: UnsafeVerbHelperRouteArguments) =>
    Route({
      method,
      ...resolveVerbHelperArguments(path, routeArguments),
    });
}

function resolveVerbHelperArguments(path: string, routeArguments: UnsafeVerbHelperRouteArguments): VerbHelperArguments {
  const isNamedRoute = isNamedVerbHelperRouteArguments(routeArguments);
  const name = isNamedRoute ? routeArguments[0] : undefined;
  const routeMiddlewareAndHandler = isNamedRoute
    ? (routeArguments.slice(1) as MiddlewareAndHandler | [])
    : routeArguments;
  const handler = requireVerbHelperHandler(routeMiddlewareAndHandler, isNamedRoute);
  const middleware = routeMiddlewareAndHandler.slice(0, -1) as HttpMiddleware[];

  return {
    path,
    name,
    middleware,
    handler,
  };
}

function isNamedVerbHelperRouteArguments(
  routeArguments: UnsafeVerbHelperRouteArguments,
): routeArguments is NamedMiddlewareAndHandler | [name: string] {
  return typeof routeArguments[0] === 'string';
}

function requireVerbHelperHandler(
  middlewareAndHandler: MiddlewareAndHandler | [],
  isNamedRoute: boolean,
): RouteHandler {
  const handler = middlewareAndHandler.at(-1) as RouteHandler | undefined;

  if (handler === undefined && isNamedRoute) {
    throw new Error('Named verb helpers require a handler.');
  }

  if (handler === undefined) {
    throw new Error('Verb helpers require a handler.');
  }

  return handler;
}

export const Get = createVerbHelper('GET');
export const Post = createVerbHelper('POST');
export const Put = createVerbHelper('PUT');
export const Patch = createVerbHelper('PATCH');
export const Delete = createVerbHelper('DELETE');
export const Head = createVerbHelper('HEAD');
export const Options = createVerbHelper('OPTIONS');
export const Any = createVerbHelper('ANY');
