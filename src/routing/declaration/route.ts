import type { HttpRequest, HttpRequestBase } from '#koala/Http/index';
import type { NormalizedRouteProps } from '#koala/routing/declaration/normalized-route-props.type';
import type { RouteProps } from '#koala/routing/declaration/route-props.type';
import { normalizeRouteProps } from '#koala/routing/normalization/normalize-route-props';

export function Route<TRequest extends HttpRequestBase = HttpRequest>(
  route: RouteProps<TRequest>,
): NormalizedRouteProps<TRequest> {
  return normalizeRouteProps(route);
}
