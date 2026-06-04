import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '@/Http';
import type { RouteOptions } from '@/routing/declaration/route-options.type';
import type { HttpMethod } from '@/routing/http-method.type';

export interface RouteProps<TRequest extends HttpRequestBase = HttpRequest> {
  name?: string;
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}
