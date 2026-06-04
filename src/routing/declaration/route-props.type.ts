import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '@/Http';
import type { HttpMethod } from '@/routing/declaration/http-method.type';
import type { RouteOptions } from '@/routing/declaration/route-options.type';

export interface RouteProps<TRequest extends HttpRequestBase = HttpRequest> {
  name?: string;
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}
