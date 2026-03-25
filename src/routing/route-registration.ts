import type { RouteDefinition } from '@/routing/route-definition';
import type { RouterMethod } from '@/routing/router-method';

export interface RouteRegistration {
  method: RouterMethod;
  path: string;
  middleware: Array<RouteDefinition['middleware'][number] | RouteDefinition['handler']>;
}
