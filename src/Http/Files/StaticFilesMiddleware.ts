import { send } from '@koa/send';
import { type HttpMiddleware, type HttpScope, type NextMiddleware } from '@/Http';
import { type HttpError } from '@/Http/Error';
import { type StaticFilesOptions } from '@/Http/Files/types';

export function serveStaticFiles(options: StaticFilesOptions = {
  root: 'public',
  index: 'index.html',
}): HttpMiddleware {
  return async function staticFilesMiddleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
    try {
      await send(scope, scope.path, options);
    } catch (error) {
      if ((error as HttpError).status !== 404) throw error;
      await next();
    }
  };
}
