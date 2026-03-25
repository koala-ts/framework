import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';
import { type EventSubscriber } from '@/Kernel';
import type { RouteSource } from '@/routing/route-source';

/**
 * @deprecated Use function-first routes from `@koala-ts/framework/routing` with `KoalaConfig.routes` instead.
 */
export type Controller = new (...args: unknown[]) => unknown;

export interface KoalaConfig {
  /**
   * @deprecated Use `routes` with `Route` from `@koala-ts/framework/routing` instead.
   */
  controllers: Controller[];
  routes?: RouteSource[];
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
