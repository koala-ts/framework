import { type Application } from '@/application/application';
import { type HttpScope } from '@/Http';
import { expandRouteDefinitions } from '@/routing/route/registration/expand-route-definitions';
import { normalizeRouteSources } from '@/routing/route/source/normalize-route-sources';
import type { RouteSource } from '@/routing/route/source/route-source';
import { validateRouteDefinitions } from '@/routing/route/validation/validate-route-definitions';
import Router, { type RouterInstance } from '@koa/router';
import { type DefaultContext, type DefaultState, type Middleware, type Request } from 'koa';

export function registerRoutes<TRequest extends Request>(
  app: Application,
  routes: RouteSource<TRequest>[] = [],
): Application {
  const router = createRouter(routes);

  app.use(router.routes() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);
  app.use(router.allowedMethods() as unknown as Middleware<DefaultState, DefaultContext & HttpScope>);

  return app;
}

function createRouter<TRequest extends Request>(routeSources: RouteSource<TRequest>[]): RouterInstance {
  const router = new Router();
  const routes = normalizeRouteSources(routeSources);
  const registrations = expandRouteDefinitions(routes);

  validateRouteDefinitions(routes, registrations);

  for (const route of registrations) {
    router[route.method](
      route.path,
      ...(route.middleware as unknown as Middleware<DefaultState, DefaultContext & HttpScope>[]),
    );
  }

  return router;
}
