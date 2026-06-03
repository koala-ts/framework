import type { HttpRequest } from '@/Http';
import type { RouteGroupDefinition } from '@/routing/group/route-group';
import type { RouteDefinition } from '@/routing/route/definition/route-definition';
import type { Request } from 'koa';

export type RouteSource<TRequest extends Request = HttpRequest> =
  | RouteDefinition<TRequest>
  | RouteGroupDefinition<TRequest>;
