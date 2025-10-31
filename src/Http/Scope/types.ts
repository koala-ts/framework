import type { Context, DefaultState, Next } from 'koa';
import { type HttpRequest } from '../Request';
import { type HttpResponse } from '../Response';

export interface HttpScope extends Context {
  request: HttpRequest;
  response: HttpResponse;
}

export type NextMiddleware = Next;
export type HttpMiddleware = (scope: HttpScope, next: NextMiddleware) => Promise<unknown>;
export type AppState = DefaultState;
