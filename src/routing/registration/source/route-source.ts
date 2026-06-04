import type { HttpRequest } from '@/Http';
import type { RouteGroupDefinition } from '@/routing/group/route-group';
import type { NormalizedRouteProps } from '@/routing/route/normalized-route-props.type';
import type { Request } from 'koa';

export type RouteSource<TRequest extends Request = HttpRequest> =
  | NormalizedRouteProps<TRequest>
  | RouteGroupDefinition<TRequest>;
