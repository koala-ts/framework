import { send } from '@koa/send';
import type { HttpError } from '#koala/Http/Error/index';
import type { StaticFilesOptions } from '#koala/Http/Files/types';
import type { HttpMiddleware, HttpScope, NextMiddleware } from '#koala/Http/index';

const defaultOptions: StaticFilesOptions = {
  root: 'public',
  index: 'index.html',
};

export function serveStaticFiles(options?: StaticFilesOptions): HttpMiddleware {
  return async function staticFilesMiddleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
    try {
      await send(scope, scope.path, options ?? defaultOptions);
    } catch (error) {
      if ((error as HttpError).status !== 404) throw error;
      await next();
    }
  };
}
