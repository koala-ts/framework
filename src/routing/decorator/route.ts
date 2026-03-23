import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from './http-method';
import type { RouteOptions } from './route-options';
import { createRouteDecorator } from './router';

export interface Route {
  path: string;
  method: HttpMethod | HttpMethod[];
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}

type RouteHandler = <T extends HttpMiddleware>(handler: T) => T;
type RouteSugarOptions = Pick<Route, 'middleware' | 'options'>;
type MethodRouteSugar = <T extends HttpMiddleware>(path: string, handler: T, configuration?: RouteSugarOptions) => T;

export const Route = createRouteDecorator;
export const get = createMethodRouteSugar('get');
export const post = createMethodRouteSugar('post');
export const put = createMethodRouteSugar('put');
export const patch = createMethodRouteSugar('patch');
export const del = createMethodRouteSugar('delete');
export const options = createMethodRouteSugar('options');
export const head = createMethodRouteSugar('head');
export const any = createMethodRouteSugar('any');
export const all = createMethodRouteSugar('all');

function createMethodRouteSugar(method: HttpMethod): MethodRouteSugar {
  return function defineMethodRoute<T extends HttpMiddleware>(
    path: string,
    handler: T,
    configuration: RouteSugarOptions = {},
  ): T {
    return applyRoute({ method, path, ...configuration })(handler);
  };
}

function applyRoute(route: Route): RouteHandler {
  return Route(route) as RouteHandler;
}
