import { type KoalaConfig } from '@/Config';
import { initializeScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files';
import { applyConfiguredGlobalMiddleware } from '@/Http/middleware/apply-configured-global-middleware';
import { initializeRequestScopeStorage } from '@/Http/Scope/request-scope-storage';
import { registerEventSubscribers } from '@/Kernel';
import { registerRoutes } from '@/routing';
import Koa from 'koa';
import { type Application } from './application';

export function create(config: KoalaConfig): Application {
  const app = new Koa() as Application;

  app.use(initializeScope);
  app.use(initializeRequestScopeStorage);
  app.use(applyConfiguredGlobalMiddleware(config.globalMiddleware));
  app.use(serveStaticFiles(config.staticFiles));
  app.use(registerRoutes());

  return registerEventSubscribers(app, config.eventSubscribers);
}
