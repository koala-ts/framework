import { type EventSubscriber } from '@/Event';
import { type HttpMiddleware } from '@/Http';
import { type StaticFilesOptions } from '@/Http/Files';

export type Controller = new(...args: unknown[]) => unknown;

export interface KoalaConfig {
  controllers: Controller[];
  globalMiddleware?: HttpMiddleware[];
  staticFiles?: StaticFilesOptions;
  eventSubscribers?: Record<string, EventSubscriber | EventSubscriber[]>;
}
