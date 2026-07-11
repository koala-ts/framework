import type { HttpRequest, HttpRequestBase } from '#koala/Http/index';
import type { NormalizedRouteProps } from '#koala/routing/declaration/normalized-route-props.type';
import type { RouterMethod } from '#koala/routing/declaration/router-method.type';

type RouteRegistrationMiddleware<TRequest extends HttpRequestBase> =
  | NormalizedRouteProps<TRequest>['middleware'][number]
  | NormalizedRouteProps<TRequest>['handler'];

export interface RouteRegistration<TRequest extends HttpRequestBase = HttpRequest> {
  method: RouterMethod;
  path: string;
  middleware: RouteRegistrationMiddleware<TRequest>[];
}
