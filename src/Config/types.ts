import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';
import { type EventSubscriber } from '@/Kernel';

export type Controller = new (...args: unknown[]) => unknown;
export type RouteModule = string;

export interface RoutingConfig {
  routeModules?: RouteModule[];
  routesDir?: string;
}

export interface KoalaConfig {
  routing?: RoutingConfig;
  controllers?: Controller[];
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
