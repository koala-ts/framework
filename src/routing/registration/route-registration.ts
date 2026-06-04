import type { HttpRequest } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouterMethod } from '@/routing/declaration/router-method.type';
import type { Request } from 'koa';

type RouteRegistrationMiddleware<TRequest extends Request> =
  | NormalizedRouteProps<TRequest>['middleware'][number]
  | NormalizedRouteProps<TRequest>['handler'];

export interface RouteRegistration<TRequest extends Request = HttpRequest> {
  method: RouterMethod;
  path: string;
  middleware: RouteRegistrationMiddleware<TRequest>[];
}
