import type { Next } from 'koa';
import type { HttpResponse } from '#koala/Http/Response/index';
import type { HttpScope } from '#koala/Http/Scope/types';

export type ScopeAwareApp = {
  context: HttpScope;
  scope: HttpScope;
};

function setHeader(this: HttpResponse, name: string, value: string | string[]): HttpResponse {
  const scope = this.ctx as HttpScope;
  scope.set(name, value);

  return this;
}

function withHeaders(this: HttpResponse, headers: Record<string, string | string[]>): HttpResponse {
  const scope = this.ctx as HttpScope;

  for (const [name, value] of Object.entries(headers)) {
    scope.set(name, value);
  }

  return this;
}

export async function initializeScope(scope: HttpScope, next: Next): Promise<void> {
  const app = scope.app as unknown as ScopeAwareApp;
  if (app.scope !== app.context) {
    app.scope = app.context;
  }

  if (scope.response.setHeader !== setHeader) {
    scope.response.setHeader = setHeader;
  }

  if (scope.response.withHeaders !== withHeaders) {
    scope.response.withHeaders = withHeaders;
  }

  await next();
}
