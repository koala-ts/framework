import type { Context, DefaultState, Next } from 'koa';
import type { HttpRequest, HttpRequestBase } from '#koala/Http/Request/index';
import type { HttpResponse } from '#koala/Http/Response/index';
import type { User } from '#koala/Security/types';

export interface HttpScope<TRequest extends HttpRequestBase = HttpRequest, TUser extends User = User> extends Context {
  request: TRequest;
  response: HttpResponse;
  user?: TUser;
}

export type NextMiddleware = Next;

export type HttpMiddleware<TRequest extends HttpRequestBase = HttpRequest> = (
  scope: HttpScope<TRequest>,
  next: NextMiddleware,
) => Promise<unknown>;

export type AppState = DefaultState;
