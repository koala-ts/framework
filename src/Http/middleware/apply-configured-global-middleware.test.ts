import { describe, expect, test, vi } from 'vitest';
import type { HttpMiddleware, HttpScope } from '#koala/Http/index';
import { applyConfiguredGlobalMiddleware } from '#koala/Http/middleware/apply-configured-global-middleware';

describe('applyConfiguredGlobalMiddleware', () => {
  test('continues to next middleware when undefined', async () => {
    const middleware = applyConfiguredGlobalMiddleware(undefined);
    const scope = {} as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('continues to next middleware when empty', async () => {
    const middleware = applyConfiguredGlobalMiddleware([]);
    const scope = {} as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('runs a single middleware', async () => {
    const calls: string[] = [];
    const configuredMiddleware: HttpMiddleware = async (_scope, next) => {
      calls.push('configured');

      await next();
    };
    const middleware = applyConfiguredGlobalMiddleware([configuredMiddleware]);
    const scope = {} as HttpScope;
    const next = vi.fn(async () => {
      calls.push('next');
    });

    await middleware(scope, next);

    expect(calls).toEqual(['configured', 'next']);
  });

  test('runs configured middleware in order', async () => {
    const calls: string[] = [];
    const firstMiddleware: HttpMiddleware = async (_scope, next) => {
      calls.push('first-before');

      await next();

      calls.push('first-after');
    };
    const secondMiddleware: HttpMiddleware = async (_scope, next) => {
      calls.push('second-before');

      await next();

      calls.push('second-after');
    };
    const middleware = applyConfiguredGlobalMiddleware([firstMiddleware, secondMiddleware]);
    const scope = {} as HttpScope;
    const next = vi.fn(async () => {
      calls.push('next');
    });

    await middleware(scope, next);

    expect(calls).toEqual(['first-before', 'second-before', 'next', 'second-after', 'first-after']);
  });
});
