import { type Application } from '@/application/application';
import { type HttpScope } from '@/Http';
import { expandRouteDefinitions } from '@/routing/expand-route-definitions';
import { normalizeRouteSources } from '@/routing/normalize-route-sources';
import type { RouteSource } from '@/routing/route-source';
import { validateRouteDefinitions } from '@/routing/validate-route-definitions';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';
import Router, { type RouterInstance } from '@koa/router';

export function registerRoutes(app: Application, routes: RouteSource[] = []): Application {
  const router = createRouter(routes);

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
}

function createRouter(routeSources: RouteSource[]): RouterInstance {
  const router = new Router();
  const routes = normalizeRouteSources(routeSources);
  const registrations = expandRouteDefinitions(routes);

  validateRouteDefinitions(routes, registrations);

  for (const route of registrations) {
    router[route.method](route.path, ...(route.middleware as Middleware<DefaultState, DefaultContext & HttpScope>[]));
  }

  return router;
}
