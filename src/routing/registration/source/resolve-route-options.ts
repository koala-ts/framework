import type { RouteOptions } from '@/routing/route/route-options.type';
import type { Request } from 'koa';
import type { NormalizedRouteProps } from '../../route/normalized-route-props.type';

function extractBodyOptions(options: RouteOptions): NormalizedRouteProps['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as NormalizedRouteProps['bodyOptions'];
}

export function mergeRouteOptions<TRequest extends Request>(
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
