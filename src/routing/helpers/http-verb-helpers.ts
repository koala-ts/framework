import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteDefinition } from '@/routing/definition/route-definition';
import { Route } from '@/routing/route';
import type { Request } from 'koa';

type RouteHandler<TRequest extends Request = HttpRequest> = HttpMiddleware<TRequest>;
type MiddlewareAndHandler<TRequest extends Request = HttpRequest> = [
  ...middleware: HttpMiddleware<TRequest>[],
  handler: RouteHandler<TRequest>,
];
type NamedMiddlewareAndHandler<TRequest extends Request = HttpRequest> = [
  name: string,
  ...middlewareAndHandler: MiddlewareAndHandler<TRequest>,
];
type VerbHelperRouteArguments<TRequest extends Request = HttpRequest> =
  | MiddlewareAndHandler<TRequest>
  | NamedMiddlewareAndHandler<TRequest>;
type UnsafeVerbHelperRouteArguments<TRequest extends Request = HttpRequest> =
  | VerbHelperRouteArguments<TRequest>
  | [name: string]
  | [];

interface VerbHelperArguments<TRequest extends Request = HttpRequest> {
  path: string;
  name?: string;
  middleware: HttpMiddleware<TRequest>[];
  handler: RouteHandler<TRequest>;
}

type NamedVerbHelper = {
  <TRequest extends Request = HttpRequest>(
    path: string,
    ...middlewareAndHandler: MiddlewareAndHandler<TRequest>
  ): RouteDefinition<TRequest>;
  <TRequest extends Request = HttpRequest>(
    path: string,
    name: string,
    ...middlewareAndHandler: MiddlewareAndHandler<TRequest>
  ): RouteDefinition<TRequest>;
};

function createVerbHelper(method: HttpMethod): NamedVerbHelper {
  return <TRequest extends Request = HttpRequest>(
    path: string,
    ...routeArguments: UnsafeVerbHelperRouteArguments<TRequest>
  ) =>
    Route({
      method,
      ...resolveVerbHelperArguments(path, routeArguments),
    });
}

function resolveVerbHelperArguments<TRequest extends Request = HttpRequest>(
  path: string,
  routeArguments: UnsafeVerbHelperRouteArguments<TRequest>,
): VerbHelperArguments<TRequest> {
  const isNamedRoute = isNamedVerbHelperRouteArguments(routeArguments);
  const name = isNamedRoute ? routeArguments[0] : undefined;
  const routeMiddlewareAndHandler = isNamedRoute
    ? (routeArguments.slice(1) as MiddlewareAndHandler<TRequest> | [])
    : routeArguments;
  const handler = requireVerbHelperHandler(routeMiddlewareAndHandler, isNamedRoute);
  const middleware = routeMiddlewareAndHandler.slice(0, -1) as HttpMiddleware<TRequest>[];

  return {
    path,
    name,
    middleware,
    handler,
  };
}

function isNamedVerbHelperRouteArguments<TRequest extends Request = HttpRequest>(
  routeArguments: UnsafeVerbHelperRouteArguments<TRequest>,
): routeArguments is NamedMiddlewareAndHandler<TRequest> | [name: string] {
  return typeof routeArguments[0] === 'string';
}

function requireVerbHelperHandler<TRequest extends Request = HttpRequest>(
  middlewareAndHandler: MiddlewareAndHandler<TRequest> | [],
  isNamedRoute: boolean,
): RouteHandler<TRequest> {
  const handler = middlewareAndHandler.at(-1) as RouteHandler<TRequest> | undefined;

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
