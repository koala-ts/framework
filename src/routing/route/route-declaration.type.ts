import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { HttpMethod } from '@/routing/registration/verb/http-method.type';
import type { RouteOptions } from '@/routing/route/route-options.type';
import type { Request } from 'koa';

export interface RouteDeclaration<TRequest extends Request = HttpRequest> {
  name?: string;
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}
