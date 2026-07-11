import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '#koala/Http/index';
import type { NormalizedRouteProps } from '#koala/routing/declaration/normalized-route-props.type';
import { Route } from '#koala/routing/declaration/route';
import type { HttpMethod } from '#koala/routing/http-method.type';

type RouteHandler<TRequest extends HttpRequestBase = HttpRequest> = HttpMiddleware<TRequest>;
type MiddlewareAndHandler<TRequest extends HttpRequestBase = HttpRequest> = [
  ...middleware: HttpMiddleware<TRequest>[],
  handler: RouteHandler<TRequest>,
];
type NamedMiddlewareAndHandler<TRequest extends HttpRequestBase = HttpRequest> = [
  name: string,
  ...middlewareAndHandler: MiddlewareAndHandler<TRequest>,
];
type VerbHelperRouteArguments<TRequest extends HttpRequestBase = HttpRequest> =
  | MiddlewareAndHandler<TRequest>
  | NamedMiddlewareAndHandler<TRequest>;
type UnsafeVerbHelperRouteArguments<TRequest extends HttpRequestBase = HttpRequest> =
  | VerbHelperRouteArguments<TRequest>
  | [name: string]
  | [];

interface VerbHelperArguments<TRequest extends HttpRequestBase = HttpRequest> {
  path: string;
  name?: string;
  middleware: HttpMiddleware<TRequest>[];
  handler: RouteHandler<TRequest>;
}

type NamedVerbHelper = {
  <TRequest extends HttpRequestBase = HttpRequest>(
    path: string,
    ...middlewareAndHandler: MiddlewareAndHandler<TRequest>
  ): NormalizedRouteProps<TRequest>;
  <TRequest extends HttpRequestBase = HttpRequest>(
    path: string,
    name: string,
    ...middlewareAndHandler: MiddlewareAndHandler<TRequest>
  ): NormalizedRouteProps<TRequest>;
};

function createVerbHelper(method: HttpMethod): NamedVerbHelper {
  return <TRequest extends HttpRequestBase = HttpRequest>(
    path: string,
    ...routeArguments: UnsafeVerbHelperRouteArguments<TRequest>
  ) =>
    Route({
      method,
      ...resolveVerbHelperArguments(path, routeArguments),
    });
}

function resolveVerbHelperArguments<TRequest extends HttpRequestBase = HttpRequest>(
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
    ...(name === undefined ? {} : { name }),
    middleware,
    handler,
  };
}

function isNamedVerbHelperRouteArguments<TRequest extends HttpRequestBase = HttpRequest>(
  routeArguments: UnsafeVerbHelperRouteArguments<TRequest>,
): routeArguments is NamedMiddlewareAndHandler<TRequest> | [name: string] {
  return typeof routeArguments[0] === 'string';
}

function requireVerbHelperHandler<TRequest extends HttpRequestBase = HttpRequest>(
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
