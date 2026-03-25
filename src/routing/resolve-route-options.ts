import type { RouteDefinition } from '@/routing/route-definition';
import type { RouteOptions } from '@/routing/route-options';

export function resolveRouteOptions(options: RouteOptions): Pick<RouteDefinition, 'parseBody' | 'bodyOptions'> {
  return {
    parseBody: options.parseBody ?? true,
    bodyOptions: extractBodyOptions(options),
  };
}

export function mergeRouteOptions(
  route: RouteDefinition,
  options: RouteOptions,
): Pick<RouteDefinition, 'parseBody' | 'bodyOptions'> {
  return {
    parseBody: options.parseBody ?? route.parseBody,
    bodyOptions: {
      ...route.bodyOptions,
      ...extractBodyOptions(options),
    },
  };
}

function extractBodyOptions(options: RouteOptions): RouteDefinition['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as RouteDefinition['bodyOptions'];
}
