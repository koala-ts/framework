import Router from '@koa/router';
import Koa, { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import { koaBody } from 'koa-body';
import { type Application } from './types';
import { extendResponse } from '@/Application/Response';
import { type KoalaConfig } from '@/Config';
import { type HttpScope } from '@/Http';
import { getRoutes } from '@/Routing';

export function create(_: KoalaConfig): Application {
  const app = new Koa() as Application;
  app.scope = app.context;

  const router = new Router();

  for (const route of getRoutes()) {
    const middlewareStack = [...(route.middleware), route.handler];

    for (const method of route.methods) {
      const routeMiddleware = route.parseBody ? [koaBody(route.bodyOptions), ...middlewareStack] : middlewareStack;
      router[method](route.path, ...(routeMiddleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
    }
  }

  app.use(extendResponse);
  app.use(router.routes());

  return app;
}
