import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';
import { type EventSubscriber } from '@/Kernel';
import type { RouteDefinition } from '@/routing/route-definition';

export type Controller = new (...args: unknown[]) => unknown;

export interface KoalaConfig {
  controllers: Controller[];
  routes?: RouteDefinition[];
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
