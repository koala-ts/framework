import { type KoalaConfig } from '@/Config';
import { type HttpScope, initializeScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files';
import { applyConfiguredGlobalMiddleware } from '@/Http/middleware/apply-configured-global-middleware';
import { initializeRequestScopeStorage } from '@/Http/Scope/request-scope-storage';
import { type EventSubscriber } from '@/Kernel';
import { getRoutes } from '@/routing';
import Router, { type RouterInstance } from '@koa/router';
import Koa, { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import { koaBody } from 'koa-body';
import { type Application } from './types';

export function create(config: KoalaConfig): Application {
  const app = new Koa() as Application;
  const router = createRouter();

  app.use(initializeScope);
  app.use(initializeRequestScopeStorage);
  app.use(applyConfiguredGlobalMiddleware(config.globalMiddleware));
  app.use(serveStaticFiles(config.staticFiles));
  app.use(router.routes() as unknown as Parameters<Application['use']>[0]);
  app.use(router.allowedMethods() as unknown as Parameters<Application['use']>[0]);

  return applyEventSubscribers(app, config);
}

function createRouter(): RouterInstance {
  const router = new Router();

  for (const route of normalizeRoutes(getRoutes())) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
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
