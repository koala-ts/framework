import { type Application } from '@/application';
import { type Next } from 'koa';
import { type HttpResponse } from '../Response';
import { type HttpScope } from './types';

export async function initializeScope(scope: HttpScope, next: Next): Promise<void> {
  const app = scope.app as unknown as Application;
  app.scope = app.context;

  scope.response.setHeader = function (name: string, value: string | string[]): HttpResponse {
    scope.set(name, value);

    return this;
  };

  scope.response.withHeaders = function (headers: Record<string, string | string[]>): HttpResponse {
    for (const [name, value] of Object.entries(headers)) {
      scope.set(name, value);
    }

    return this;
  };

  await next();
}
