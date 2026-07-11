import { describe, expect, it, type Mock, vi } from 'vitest';
import type { HttpScope } from '@/Http';
import { serveStaticFiles } from '@/Http/Files/StaticFilesMiddleware';

vi.mock('@koa/send', () => ({
  send: vi.fn(),
}));

describe('Static Files middleware', () => {
  it('should delegate calls to koa send', async () => {
    const { send } = await import('@koa/send');
    const scope = { path: '/test-path' } as HttpScope;
    const next = vi.fn();
    const defaultOptions = { root: 'public', index: 'index.html' };

    await serveStaticFiles()(scope, next);

    expect(send).toHaveBeenCalledWith(scope, scope.path, defaultOptions);
    expect(next).not.toHaveBeenCalled();
  });

  it('should rethrow non-404 errors', async () => {
    const { send } = await import('@koa/send');
    (send as Mock).mockRejectedValueOnce({ status: 500 });
    const scope = { path: '/test-path' } as HttpScope;
    const next = vi.fn();

    await expect(serveStaticFiles()(scope, next)).rejects.toEqual({ status: 500 });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next on 404 errors', async () => {
    const { send } = await import('@koa/send');
    (send as Mock).mockRejectedValueOnce({ status: 404 });
    const scope = { path: '/test-path' } as HttpScope;
    const next = vi.fn();

    await serveStaticFiles()(scope, next);

    expect(next).toHaveBeenCalled();
  });
});
