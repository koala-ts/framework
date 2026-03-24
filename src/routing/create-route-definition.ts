import type { HttpMiddleware } from '@/Http';
import type { HttpMethod } from '@/routing/http-method';
import type { RouteOptions } from '@/routing/route-options';
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
  return {
    name,
    path,
    methods: qualifyMethods(method),
    handler,
    parseBody: options.parseBody ?? true,
    middleware,
    bodyOptions: extractBodyOptions(options),
  };
}

function qualifyMethods(method: HttpMethod | HttpMethod[]): RouterMethod[] {
  const methods = Array.isArray(method) ? method : [method];

  return methods.map(method => {
    const lower = method.toLowerCase() as RouterMethod;

    return ['any', 'all'].includes(lower) ? 'all' : lower;
  });
}

function extractBodyOptions(options: RouteOptions): RouteDefinition['bodyOptions'] {
  const { parseBody: _parseBody, ...bodyOptions } = options;

  return bodyOptions as RouteDefinition['bodyOptions'];
}
