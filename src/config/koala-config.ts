import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';
import { type EventSubscriber } from '@/Kernel';
import type { RouteSource } from '@/routing';
import type { DotenvConfigOptions } from 'dotenv';
import type { HttpRequest } from '@/Http';
import type { Request } from 'koa';

/**
 * @deprecated Use function-first routes from `@koala-ts/framework/routing` with `KoalaConfig.routes` instead.
 */
export type Controller = new (...args: unknown[]) => unknown;

export type KoalaDotenvOptions = Pick<DotenvConfigOptions, 'debug' | 'encoding' | 'override' | 'quiet'>;

export interface KoalaConfig<TRequest extends Request = HttpRequest> {
  /**
   * @deprecated Use `routes` with `Route` from `@koala-ts/framework/routing` instead.
   */
  controllers: Controller[];
  environment?: {
    dotenv?: KoalaDotenvOptions;
  };
  routes?: RouteSource<TRequest>[];
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
