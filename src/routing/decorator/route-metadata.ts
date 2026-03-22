import type { HttpMiddleware } from '@/Http';
import type { RouteOptions } from './route-options';
import type { RouterMethod } from './router-method';

export interface RouteMetadata {
  path: string;
  methods: RouterMethod[];
  handler: HttpMiddleware;
  parseBody: boolean;
  middleware: HttpMiddleware[];
  bodyOptions: Partial<RouteOptions>;
}
