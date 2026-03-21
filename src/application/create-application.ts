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
  const app = createBaseApplication();

  if (undefined !== config.globalMiddleware) {
    applyGlobalMiddleware(app, config.globalMiddleware);
  }

  app.use(serveStaticFiles(config.staticFiles));

  mountRouter(app, createRouter());

  if (undefined !== config.eventSubscribers) {
    registerEventSubscribers(app, config.eventSubscribers);
  }

  return app;
}

function createBaseApplication(): Application {
  const app = new Koa() as Application;
  app.scope = app.context;

  app.use(extendResponse);
  app.use(httpKernel);

  return app;
}

function createRouter(): RouterInstance {
  const router = new Router();

  for (const route of normalizeRoutes(getRoutes())) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
}

function mountRouter(app: Application, router: RouterInstance): Application {
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

function normalizeRoutes(routes: ReturnType<typeof getRoutes>): Array<{
  method: (typeof routes)[number]['methods'][number];
  path: (typeof routes)[number]['path'];
  middleware: Array<(typeof routes)[number]['middleware'][number] | (typeof routes)[number]['handler']>;
}> {
  const registrations: Array<{
    method: (typeof routes)[number]['methods'][number];
    path: (typeof routes)[number]['path'];
    middleware: Array<(typeof routes)[number]['middleware'][number] | (typeof routes)[number]['handler']>;
  }> = [];

  for (const route of routes) {
    const middleware = resolveRouteMiddleware(route);

    for (const method of route.methods) {
      registrations.push({
        method,
        path: route.path,
        middleware,
      });
    }
  }

  return registrations;
}

function resolveRouteMiddleware(
  route: ReturnType<typeof getRoutes>[number],
): Array<ReturnType<typeof getRoutes>[number]['middleware'][number] | ReturnType<typeof getRoutes>[number]['handler']> {
  const middlewareStack = [...route.middleware, route.handler];

  return route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
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
