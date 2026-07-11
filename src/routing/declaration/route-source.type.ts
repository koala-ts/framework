import type { HttpRequest, HttpRequestBase } from '#koala/Http/index';
import type { NormalizedRouteProps } from '#koala/routing/declaration/normalized-route-props.type';
import type { RouteGroupDefinition } from '#koala/routing/declaration/route-group';

export type RouteSource<TRequest extends HttpRequestBase = HttpRequest> =
  | NormalizedRouteProps<TRequest>
  | RouteGroupDefinition<TRequest>;
