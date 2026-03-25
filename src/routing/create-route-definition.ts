import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteOptions } from '@/routing/route-options';
import { resolveRouteOptions } from '@/routing/resolve-route-options';
import type { RouterMethod } from '@/routing/router-method';
import type { RouteDefinition } from './route-definition';

interface RouteDefinitionInput {
  name?: string;
  method: HttpMethod | HttpMethod[];
  path: string;
  handler: HttpMiddleware;
  middleware?: HttpMiddleware[];
  options?: RouteOptions;
}

export function createRouteDefinition({
  name,
  method,
  path,
  handler,
  middleware = [],
  options = {},
}: RouteDefinitionInput): RouteDefinition {
  const routeOptions = resolveRouteOptions(options);

  return {
    name,
    path,
    methods: qualifyMethods(method),
    handler,
    middleware,
    ...routeOptions,
  };
}

function qualifyMethods(method: HttpMethod | HttpMethod[]): RouterMethod[] {
  const methods = Array.isArray(method) ? method : [method];
  const qualifiedMethods: RouterMethod[] = methods.map(method => {
    const lower = method.toLowerCase() as RouterMethod;

    return ['any', 'all'].includes(lower) ? 'all' : lower;
  });

  return qualifiedMethods.includes('all') ? ['all'] : [...new Set<RouterMethod>(qualifiedMethods)];
}
