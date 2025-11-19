import { send } from '@koa/send';
import { type HttpMiddleware, type HttpScope, type NextMiddleware } from '@/Http';
import { type HttpError } from '@/Http/Error';
import { type StaticFilesOptions } from '@/Http/Files/types';

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
