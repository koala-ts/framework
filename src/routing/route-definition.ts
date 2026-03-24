import type { HttpMiddleware } from '@/Http';
import type { RouteOptions } from '@/routing/route-options';
import type { RouterMethod } from '@/routing/router-method';

export interface RouteDefinition {
  name?: string;
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  middleware: HttpMiddleware[];
  parseBody: boolean;
  bodyOptions: Partial<RouteOptions>;
}
