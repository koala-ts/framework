import type { RouteDefinition } from '@/routing/definition/route-definition';
import type { RouteGroupDefinition } from '@/routing/helpers/route-group';
import type { HttpRequest } from '@/Http';
import type { Request } from 'koa';

export type RouteSource<TRequest extends Request = HttpRequest> =
  | RouteDefinition<TRequest>
  | RouteGroupDefinition<TRequest>;
