import type { HttpRequest } from '@/Http';
import type { HttpMethod } from '@/routing/registration/verb/http-method.type';
import { RouteProps } from '@/routing/route-props.type';
import type { NormalizedRouteProps } from '@/routing/route/normalized-route-props.type';
import type { RouteOptions } from '@/routing/route/route-options.type';
import type { RouterMethod } from '@/routing/route/router-method.type';
import type { Request } from 'koa';

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

export function createRouteDefinition<TRequest extends Request = HttpRequest>(
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

export function Route<TRequest extends Request = HttpRequest>(
  route: RouteProps<TRequest>,
): NormalizedRouteProps<TRequest> {
  return createRouteDefinition(route);
}
