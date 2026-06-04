import type { HttpMiddleware, HttpRequest } from '@/Http';
import type { RouteOptions } from '@/routing/route/route-options.type';
import type { RouterMethod } from '@/routing/route/router-method.type';
import type { HttpMethod } from '@/routing/verb/http-method.type';
import type { Request } from 'koa';
import type { RouteDefinition } from './route-definition.type';

interface RouteProps<TRequest extends Request = HttpRequest> {
  name?: string;
  method: HttpMethod | HttpMethod[];
  path: string;
  handler: HttpMiddleware<TRequest>;
  middleware?: HttpMiddleware<TRequest>[];
  options?: RouteOptions;
}

function resolveRouteOptions(options: RouteOptions): Pick<RouteDefinition, 'parseBody' | 'bodyOptions'> {
  return {
    parseBody: options.parseBody ?? true,
    bodyOptions: extractBodyOptions(options),
  };
}

function extractBodyOptions(options: RouteOptions): RouteDefinition['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as RouteDefinition['bodyOptions'];
}

export function createRouteDefinition<TRequest extends Request = HttpRequest>(
  routeProps: RouteProps<TRequest>,
): RouteDefinition<TRequest> {
  return {
    name: routeProps.name,
    path: routeProps.path,
    methods: qualifyMethods(routeProps.method),
    handler: routeProps.handler,
    middleware: routeProps.middleware ?? [],
    ...resolveRouteOptions(routeProps.options ?? {}),
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
