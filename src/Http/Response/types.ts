import type { Response } from 'koa';

export interface HttpResponse extends Response {
  setHeader(name: string, value: string | string[]): HttpResponse;

  withHeaders(headers: Record<string, string | string[]>): HttpResponse;
}
