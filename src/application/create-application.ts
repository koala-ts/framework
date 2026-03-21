import { type KoalaConfig } from '@/Config';
import { initializeScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files';
import { applyConfiguredGlobalMiddleware } from '@/Http/middleware/apply-configured-global-middleware';
import { initializeRequestScopeStorage } from '@/Http/Scope/request-scope-storage';
import { type EventSubscriber } from '@/Kernel';
import { registerRoutes } from '@/routing';
import Koa from 'koa';
import { type Application } from './types';

export function create(config: KoalaConfig): Application {
  const app = new Koa() as Application;

  app.use(initializeScope);
  app.use(initializeRequestScopeStorage);
  app.use(applyConfiguredGlobalMiddleware(config.globalMiddleware));
  app.use(serveStaticFiles(config.staticFiles));
  app.use(registerRoutes);

  return applyEventSubscribers(app, config);
}

function registerEventSubscribers(app: Application, map: Record<string, EventSubscriber | EventSubscriber[]>): void {
  for (const [event, subscriber] of normalizeEventSubscribers(map)) {
    app.on(event, subscriber as unknown as (...args: unknown[]) => void);
  }
}

function normalizeEventSubscribers(
  map: Record<string, EventSubscriber | EventSubscriber[]>,
): Array<[string, EventSubscriber]> {
  const subscriptions: Array<[string, EventSubscriber]> = [];

  for (const [event, subscribers] of Object.entries(map)) {
    if (Array.isArray(subscribers)) {
      for (const subscriber of subscribers) {
        subscriptions.push([event, subscriber]);
      }

      continue;
    }

    subscriptions.push([event, subscribers]);
  }

  return subscriptions;
}

function applyEventSubscribers(app: Application, config: KoalaConfig): Application {
  if (undefined !== config.eventSubscribers) {
    registerEventSubscribers(app, config.eventSubscribers);
  }

  return app;
}
