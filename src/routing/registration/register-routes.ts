import Router, { type RouterInstance } from '@koa/router';
import type { DefaultContext, DefaultState, Middleware } from 'koa';
import type { Application } from '#koala/application/application';
import type { HttpRequestBase, HttpScope } from '#koala/Http/index';
import type { RouteSource } from '#koala/routing/declaration/route-source.type';
import { normalizeRouteSources } from '#koala/routing/normalization/normalize-route-sources';
import { createRouteRegistrations } from '#koala/routing/registration/create-route-registrations';
import { validateRouteRegistrations } from '#koala/routing/registration/validate-route-registrations';

export function registerRoutes<TRequest extends HttpRequestBase>(
  app: Application,
  routes: RouteSource<TRequest>[] = [],
): Application {
  const router = createRouter(routes);

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
}

function createRouter<TRequest extends HttpRequestBase>(routeSources: RouteSource<TRequest>[]): RouterInstance {
  const router = new Router();
  const routes = normalizeRouteSources(routeSources);
  const registrations = createRouteRegistrations(routes);

  validateRouteRegistrations(routes, registrations);

  for (const route of registrations) {
    router[route.method](
      route.path,
      ...(route.middleware as unknown as Middleware<DefaultState, DefaultContext & HttpScope>[]),
    );
  }

  return router;
}
