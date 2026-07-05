import type { HttpRequest, HttpRequestBase } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteGroupDefinition } from '@/routing/declaration/route-group';

export type RouteSource<TRequest extends HttpRequestBase = HttpRequest> =
  NormalizedRouteProps<TRequest> | RouteGroupDefinition<TRequest>;
