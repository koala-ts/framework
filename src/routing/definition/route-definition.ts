import type { HttpMiddleware } from '@/Http';
import type { RouterMethod } from '@/routing/router-method';
import type { KoaBodyMiddlewareOptions } from 'koa-body';

export interface RouteDefinition {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  middleware: HttpMiddleware[];
  parseBody: boolean;
  bodyOptions: Partial<KoaBodyMiddlewareOptions>;
}
