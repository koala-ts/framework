import type { Request } from 'koa';
import Koa from 'koa';
import type { Application } from '#koala/application/application';
import type { KoalaConfig } from '#koala/config/koala-config';
import { serveStaticFiles } from '#koala/Http/Files/index';
import { initializeScope } from '#koala/Http/index';
import { applyConfiguredGlobalMiddleware } from '#koala/Http/middleware/apply-configured-global-middleware';
import { initializeRequestScopeStorage } from '#koala/Http/Scope/request-scope-storage';
import { registerEventSubscribers } from '#koala/Kernel/index';
import { registerLegacyRoutes } from '#koala/routing/deprecated-decorator/legacy-router';
import { verifyRoutingMode } from '#koala/routing/deprecated-decorator/verify-routing-mode';
import { registerRoutes } from '#koala/routing/registration/register-routes';

export function create<TRequest extends Request>(config: KoalaConfig<TRequest>): Application {
  const app = new Koa() as Application;
  const controllers = config.controllers ?? [];

  app.use(initializeScope);
  app.use(initializeRequestScopeStorage);
  app.use(applyConfiguredGlobalMiddleware(config.globalMiddleware));
  app.use(serveStaticFiles(config.staticFiles));

  verifyRoutingMode(config);

  if (config.routes === undefined || controllers.length > 0) {
    registerLegacyRoutes(app);
  }

  registerRoutes(app, config.routes);
  registerEventSubscribers(app, config.eventSubscribers);

  return app;
}
