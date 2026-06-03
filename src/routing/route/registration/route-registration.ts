import type { HttpRequest } from '@/Http';
import type { RouteDefinition } from '@/routing/route/definition/route-definition.type';
import type { RouterMethod } from '@/routing/route/router-method.type';
import type { Request } from 'koa';

type RouteRegistrationMiddleware<TRequest extends Request> =
  | RouteDefinition<TRequest>['middleware'][number]
  | RouteDefinition<TRequest>['handler'];

export interface RouteRegistration<TRequest extends Request = HttpRequest> {
  method: RouterMethod;
  path: string;
  middleware: RouteRegistrationMiddleware<TRequest>[];
}
