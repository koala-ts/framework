import type { RouteOptions } from '@/routing/route/route-options.type';
import type { Request } from 'koa';
import type { RouteDefinition } from './route-definition.type';

function extractBodyOptions(options: RouteOptions): RouteDefinition['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as RouteDefinition['bodyOptions'];
}

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
