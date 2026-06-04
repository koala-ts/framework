import { extractBodyOptions } from '@/routing/route/create-route-definition';
import type { RouteOptions } from '@/routing/route/route-options.type';
import type { Request } from 'koa';
import type { RouteDefinition } from './route-definition.type';

export function mergeRouteOptions<TRequest extends Request>(
  route: RouteDefinition<TRequest>,
  options: RouteOptions,
): Pick<RouteDefinition<TRequest>, 'parseBody' | 'bodyOptions'> {
  return {
    parseBody: options.parseBody ?? route.parseBody,
    bodyOptions: {
      ...route.bodyOptions,
      ...extractBodyOptions(options),
    },
  };
}
