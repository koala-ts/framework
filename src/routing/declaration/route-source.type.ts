import type { HttpRequest } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteGroupDefinition } from '@/routing/declaration/route-group';
import type { Request } from 'koa';

export type RouteSource<TRequest extends Request = HttpRequest> =
  | NormalizedRouteProps<TRequest>
  | RouteGroupDefinition<TRequest>;
