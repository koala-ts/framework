import type { HttpRequest, HttpRequestBase } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import { RouteProps } from '@/routing/declaration/route-props.type';
import { normalizeRouteProps } from '@/routing/normalization/normalize-route-props';

export function Route<TRequest extends HttpRequestBase = HttpRequest>(
  route: RouteProps<TRequest>,
): NormalizedRouteProps<TRequest> {
  return normalizeRouteProps(route);
}
