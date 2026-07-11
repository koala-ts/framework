import type { HttpMiddleware } from '#koala/Http/index';

export function applyConfiguredGlobalMiddleware(middleware: HttpMiddleware[] | undefined = []): HttpMiddleware {
  return async (scope, next) => {
    const pipeline = middleware.reduceRight<() => Promise<unknown>>(
      (stack, current) => {
        return async () => await current(scope, stack);
      },
      async () => await next(),
    );

    await pipeline();
  };
}
