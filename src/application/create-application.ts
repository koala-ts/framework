import { type KoalaConfig } from '@/config/koala-config';
import { initializeScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files';
import { applyConfiguredGlobalMiddleware } from '@/Http/middleware/apply-configured-global-middleware';
import { initializeRequestScopeStorage } from '@/Http/Scope/request-scope-storage';
import { registerEventSubscribers } from '@/Kernel';
import { registerLegacyRoutes } from '@/routing/deprecated-decorator/legacy-router';
import { registerRoutes } from '@/routing/registration/register-routes';
import { verifyRoutingMode } from '@/routing/verify-routing-mode';
import type { Request } from 'koa';
import Koa from 'koa';
import { type Application } from './application';

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
