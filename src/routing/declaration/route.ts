import type { HttpRequest } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import { RouteProps } from '@/routing/declaration/route-props.type';
import { normalizeRouteProps } from '@/routing/normalization/normalize-route-props';
import type { Request } from 'koa';

export function Route<TRequest extends Request = HttpRequest>(
  route: RouteProps<TRequest>,
): NormalizedRouteProps<TRequest> {
  return normalizeRouteProps(route);
}
