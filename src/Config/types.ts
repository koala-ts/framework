import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';
import { type EventSubscriber } from '@/Kernel';

export type Controller = new (...args: unknown[]) => unknown;
export type RouteModule = string;
export type RouteManifest = string;

export interface KoalaConfig {
  controllers?: Controller[];
  routeModules?: RouteModule[];
  routesDir?: string;
  routeManifest?: RouteManifest;
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
