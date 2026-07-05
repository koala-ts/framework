import type { HttpRequest, HttpRequestBase } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouterMethod } from '@/routing/declaration/router-method.type';

type RouteRegistrationMiddleware<TRequest extends HttpRequestBase> =
  NormalizedRouteProps<TRequest>['middleware'][number] | NormalizedRouteProps<TRequest>['handler'];

export interface RouteRegistration<TRequest extends HttpRequestBase = HttpRequest> {
  method: RouterMethod;
  path: string;
  middleware: RouteRegistrationMiddleware<TRequest>[];
}
