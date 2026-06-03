import type { HttpRequest } from '@/Http';
import type { RouteDefinition } from '@/routing/definition/route-definition';
import type { RouterMethod } from '@/routing/router-method.type';
import type { Request } from 'koa';

type RouteRegistrationMiddleware<TRequest extends Request> =
  | RouteDefinition<TRequest>['middleware'][number]
  | RouteDefinition<TRequest>['handler'];

export interface RouteRegistration<TRequest extends Request = HttpRequest> {
  method: RouterMethod;
  path: string;
  middleware: RouteRegistrationMiddleware<TRequest>[];
}
