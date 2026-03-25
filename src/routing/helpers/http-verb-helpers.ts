import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteDefinition } from '@/routing/definition/route-definition';
import { Route } from '@/routing/route';

type RouteHandler = HttpMiddleware;
interface VerbHelperArguments {
  path: string;
  name?: string;
  handler: RouteHandler;
}

type NamedVerbHelper = {
  (path: string, handler: RouteHandler): RouteDefinition;
  (path: string, name: string, handler: RouteHandler): RouteDefinition;
};

function createVerbHelper(method: HttpMethod): NamedVerbHelper {
  return (path: string, nameOrHandler: string | RouteHandler, maybeHandler?: RouteHandler) =>
    Route({
      method,
      ...resolveVerbHelperArguments(path, nameOrHandler, maybeHandler),
    });
}

function resolveVerbHelperArguments(
  path: string,
  nameOrHandler: string | RouteHandler,
  maybeHandler?: RouteHandler,
): VerbHelperArguments {
  const isNamedRoute = typeof nameOrHandler === 'string';
  const name = isNamedRoute ? nameOrHandler : undefined;
  const handler = isNamedRoute ? requireNamedVerbHelperHandler(maybeHandler) : nameOrHandler;

  return {
    path,
    name,
    handler,
  };
}

function requireNamedVerbHelperHandler(handler?: RouteHandler): RouteHandler {
  if (handler === undefined) {
    throw new Error('Named verb helpers require a handler.');
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
