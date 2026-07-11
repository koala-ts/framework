import type { Context, DefaultState, Next } from 'koa';
import type { User } from '@/Security/types';
import type { HttpRequest, HttpRequestBase } from '../Request';
import type { HttpResponse } from '../Response';

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
