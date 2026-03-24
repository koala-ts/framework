import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import { Route } from './route';
import type { RouteDefinition } from './route-definition';

type RouteHandler = HttpMiddleware;

function createVerbHelper(method: HttpMethod): (path: string, handler: RouteHandler) => RouteDefinition {
  return (path, handler) =>
    Route({
      method,
      path,
      handler,
    });
}

export const Get = createVerbHelper('GET');
export const Post = createVerbHelper('POST');
export const Put = createVerbHelper('PUT');
export const Patch = createVerbHelper('PATCH');
export const Delete = createVerbHelper('DELETE');
export const Head = createVerbHelper('HEAD');
export const Options = createVerbHelper('OPTIONS');
export const Any = createVerbHelper('ANY');
