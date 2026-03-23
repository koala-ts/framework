import type { HttpMiddleware } from '@/Http';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';
import type { RouterMethod } from '@/routing/decorator/router-method';
import type { KoaBodyMiddlewareOptions } from 'koa-body';

export interface RouteDefinition {
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  parseBody: boolean;
  middleware: HttpMiddleware[];
  bodyOptions: Partial<KoaBodyMiddlewareOptions>;
  source?: string;
}

export function toRouteDefinition(route: RouteMetadata): RouteDefinition {
  return {
    bodyOptions: route.bodyOptions,
    handler: route.handler,
    methods: route.methods,
    middleware: route.middleware,
    parseBody: route.parseBody,
    path: route.path,
    source: route.source,
  };
}

export function toRouteMetadata(route: RouteDefinition): RouteMetadata {
  return {
    bodyOptions: route.bodyOptions,
    handler: route.handler,
    methods: route.methods,
    middleware: route.middleware,
    parseBody: route.parseBody,
    path: route.path,
    source: route.source,
  };
}
