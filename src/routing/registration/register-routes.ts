import { type Application } from '@/application/application';
import { type HttpRequestBase, type HttpScope } from '@/Http';
import type { RouteSource } from '@/routing/declaration/route-source.type';
import { normalizeRouteSources } from '@/routing/normalization/normalize-route-sources';
import { createRouteRegistrations } from '@/routing/registration/create-route-registrations';
import { validateRouteRegistrations } from '@/routing/registration/validate-route-registrations';
import Router, { type RouterInstance } from '@koa/router';
import { type DefaultContext, type DefaultState, type Middleware } from 'koa';

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
