import type { HttpRequest, HttpRequestBase } from '@/Http';
import type { HttpMethod } from '@/routing/declaration/http-method.type';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteOptions } from '@/routing/declaration/route-options.type';
import { RouteProps } from '@/routing/declaration/route-props.type';
import type { RouterMethod } from '@/routing/declaration/router-method.type';

function resolveRouteOptions(options: RouteOptions): Pick<NormalizedRouteProps, 'parseBody' | 'bodyOptions'> {
  return {
    parseBody: options.parseBody ?? true,
    bodyOptions: extractBodyOptions(options),
  };
}

function extractBodyOptions(options: RouteOptions): NormalizedRouteProps['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as NormalizedRouteProps['bodyOptions'];
}

function qualifyMethods(method: HttpMethod | HttpMethod[]): RouterMethod[] {
  const methods = Array.isArray(method) ? method : [method];
  const qualifiedMethods: RouterMethod[] = methods.map(method => {
    const lower = method.toLowerCase() as RouterMethod;

    return ['any', 'all'].includes(lower) ? 'all' : lower;
  });

  return qualifiedMethods.includes('all') ? ['all'] : [...new Set<RouterMethod>(qualifiedMethods)];
}

export function normalizeRouteProps<TRequest extends HttpRequestBase = HttpRequest>(
  routeProps: RouteProps<TRequest>,
): NormalizedRouteProps<TRequest> {
  return {
    name: routeProps.name,
    path: routeProps.path,
    methods: qualifyMethods(routeProps.method),
    handler: routeProps.handler,
    middleware: routeProps.middleware ?? [],
    ...resolveRouteOptions(routeProps.options ?? {}),
  };
}
