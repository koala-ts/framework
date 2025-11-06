import { type HttpMiddleware } from '@/Http';

export type Controller = new(...args: unknown[]) => unknown;

export interface KoalaConfig {
  controllers: Controller[];
  globalMiddleware?: HttpMiddleware[];
}
