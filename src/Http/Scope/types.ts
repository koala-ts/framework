import type { Context, DefaultState, Next, Request } from 'koa';
import { type HttpRequest } from '../Request';
import { type HttpResponse } from '../Response';

export interface HttpScope<TRequest extends Request = HttpRequest> extends Context {
  request: TRequest;
  response: HttpResponse;
}

export type NextMiddleware = Next;

export type HttpMiddleware<TRequest extends Request = HttpRequest> = (
  scope: HttpScope<TRequest>,
  next: NextMiddleware,
) => Promise<unknown>;

export type AppState = DefaultState;
