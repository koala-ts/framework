import Router from '@koa/router';
import Koa, { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import { koaBody } from 'koa-body';
import { type Application } from './types';
import { extendResponse } from '@/Application/Response';
import { type KoalaConfig } from '@/Config';
import { type HttpMiddleware, type HttpScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files';
import { getRoutes } from '@/Routing';

export function create(config: KoalaConfig): Application {
  const app = new Koa() as Application;
  app.scope = app.context;

  app.use(extendResponse);
  if (undefined !== config.globalMiddleware) registerGlobalMiddleware(app, config.globalMiddleware);

  app.use(serveStaticFiles(config.staticFiles));

  // Register routes
  const router = createRouter();
  app.use(router.routes());
  app.use(router.allowedMethods());

  registerEventSubscribers(app, config.eventSubscribers);

  return app;
}

function createRouter(): Router {
  const router = new Router();

  for (const route of getRoutes()) {
    const middlewareStack = [...(route.middleware), route.handler];

    for (const method of route.methods) {
      const routeMiddleware = route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
      router[method](route.path, ...(routeMiddleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
    }
  }

  return router;
}

function registerGlobalMiddleware(app: Application, middleware: HttpMiddleware[]): void {
  for (const mw of middleware) {
    app.use(mw);
  }
}

function registerEventSubscribers(app: Application, map: KoalaConfig['eventSubscribers']): void {
  if (undefined === map) return;

  for (const [event, subscribers] of Object.entries(map)) {
    if (Array.isArray(subscribers)) {
      for (const subscriber of subscribers) app.on(event, subscriber);
      continue;
    }

    app.on(event, subscribers);
  }
}
