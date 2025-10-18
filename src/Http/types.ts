import type { File } from 'formidable';
import type { Context, DefaultState, Next, Request, Response } from 'koa';

export type UploadedFile = File;
export type UploadedFilesMap = Record<string, UploadedFile | UploadedFile[]>;

export interface HttpRequest extends Request {
  body?: Record<string, unknown>;
  files?: UploadedFilesMap;
  params: Record<string, unknown>;
}

export interface HttpResponse extends Response {
  setHeader(name: string, value: string | string[]): HttpResponse;

  withHeaders(headers: Record<string, string | string[]>): HttpResponse;
}

export interface HttpScope extends Context {
  request: HttpRequest;
  response: HttpResponse;
}

export type NextMiddleware = Next;
export type HttpMiddleware = (scope: HttpScope, next: NextMiddleware) => Promise<unknown>;
export type AppState = DefaultState;
