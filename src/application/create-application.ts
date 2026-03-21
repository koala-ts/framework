import { extendResponse } from '@/application/Response';
import { type KoalaConfig } from '@/Config';
import { type HttpMiddleware, type HttpScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files';
import { type EventSubscriber, httpKernel } from '@/Kernel';
import { getRoutes } from '@/Routing';
import Router, { type RouterInstance } from '@koa/router';
import Koa, { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import { koaBody } from 'koa-body';
import { type Application } from './types';

export function create(config: KoalaConfig): Application {
  const app = new Koa() as Application;
  app.scope = app.context;

  app.use(extendResponse);
  app.use(httpKernel);

  if (undefined !== config.globalMiddleware) {
    applyGlobalMiddleware(app, config.globalMiddleware);
  }

  app.use(serveStaticFiles(config.staticFiles));

  // Register routes
  const router = createRouter();
  app.use(router.routes());
  app.use(router.allowedMethods());

  if (undefined !== config.eventSubscribers) {
    registerEventSubscribers(app, config.eventSubscribers);
  }

  return app;
}

function createRouter(): RouterInstance {
  const router = new Router();

  for (const route of getRoutes()) {
    const middlewareStack = [...route.middleware, route.handler];

    for (const method of route.methods) {
      const routeMiddleware = route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
      router[method](route.path, ...(routeMiddleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
    }
  }

  return router;
}

function applyGlobalMiddleware(app: Application, middleware: HttpMiddleware[]): Application {
  return middleware.reduce(registerMiddleware, app);
}

function registerMiddleware(app: Application, middleware: HttpMiddleware): Application {
  app.use(middleware);

  return app;
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
