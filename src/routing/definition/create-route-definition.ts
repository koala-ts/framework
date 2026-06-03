import type { HttpMiddleware, HttpRequest } from '@/Http';
import { resolveRouteOptions } from '@/routing/definition/resolve-route-options';
import type { HttpMethod } from '@/routing/http-method.type';
import type { RouteOptions } from '@/routing/route-options';
import type { RouterMethod } from '@/routing/router-method';
import type { Request } from 'koa';
import type { RouteDefinition } from './route-definition';

interface RouteDefinitionInput<TRequest extends Request = HttpRequest> {
  name?: string;
  method: HttpMethod | HttpMethod[];
  path: string;
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}

export function createRouteDefinition<TRequest extends Request = HttpRequest>({
  name,
  method,
  path,
  handler,
  middleware = [],
  options = {},
}: RouteDefinitionInput<TRequest>): RouteDefinition<TRequest> {
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
