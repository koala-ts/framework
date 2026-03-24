import type { HttpMiddleware } from '@/Http';
import type { KoaBodyMiddlewareOptions } from 'koa-body';
import type { RouterMethod } from '@/routing/router-method';

export interface RouteDefinition {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  middleware: HttpMiddleware[];
  parseBody: boolean;
  bodyOptions: Partial<KoaBodyMiddlewareOptions>;
}
