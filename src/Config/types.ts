import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';
import { type EventSubscriber } from '@/Kernel';

export type Controller = new (...args: unknown[]) => unknown;

export interface KoalaConfig {
  controllers: Controller[];
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
