import type { HttpMiddleware, HttpRequest, HttpRequestBase } from '#koala/Http/index';
import type { RouteOptions } from '#koala/routing/declaration/route-options.type';
import type { HttpMethod } from '#koala/routing/http-method.type';

export interface RouteProps<TRequest extends HttpRequestBase = HttpRequest> {
  name?: string;
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}
