import type { HttpRequestBase } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteOptions } from '@/routing/declaration/route-options.type';

function extractBodyOptions(options: RouteOptions): NormalizedRouteProps['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as NormalizedRouteProps['bodyOptions'];
}

export function mergeRouteOptions<TRequest extends HttpRequestBase>(
  route: NormalizedRouteProps<TRequest>,
  options: RouteOptions,
): Pick<NormalizedRouteProps<TRequest>, 'parseBody' | 'bodyOptions'> {
  return {
    parseBody: options.parseBody ?? route.parseBody,
    bodyOptions: {
      ...route.bodyOptions,
      ...extractBodyOptions(options),
    },
  };
}
