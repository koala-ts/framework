import { type Next } from 'koa';
import { type HttpResponse, type HttpScope } from '@/Http';

export async function extendResponse(scope: HttpScope, next: Next): Promise<void> {
  scope.response.setHeader = function(name: string, value: string | string[]): HttpResponse {
    scope.set(name, value);

    return this;
  };

  scope.response.withHeaders = function(headers: Record<string, string | string[]>): HttpResponse {
    for (const [name, value] of Object.entries(headers)) {
      scope.set(name, value);
    }

    return this;
  };

  await next();
}
