import { type Application } from '@/application/application';
import { type HttpScope } from '@/Http';
import { expandRouteDefinitions } from '@/routing/expand-route-definitions';
import type { RouteDefinition } from '@/routing/route-definition';
import { validateRouteDefinitions } from '@/routing/validate-route-definitions';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import Router, { type RouterInstance } from '@koa/router';

export function registerRoutes(app: Application, routes: RouteDefinition[] = []): Application {
  const router = createRouter(routes);

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
}

function createRouter(routes: RouteDefinition[]): RouterInstance {
  const router = new Router();
  const registrations = expandRouteDefinitions(routes);

  validateRouteDefinitions(routes, registrations);

  for (const route of registrations) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
}
