import { type HttpMiddleware } from '@/Http';

export function applyConfiguredGlobalMiddleware(middleware: HttpMiddleware[] = []): HttpMiddleware {
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
