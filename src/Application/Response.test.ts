import { type Next } from 'koa';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { extendResponse } from '@/Application/Response';
import { type HttpScope } from '@/Http';

describe('Response', () => {
  describe('Extend response', () => {
    let scope: HttpScope;
    let next: Next;

    beforeEach(() => {
      scope = { response: {}, set: vi.fn() } as unknown as HttpScope;
      next = vi.fn();
    });

    test('it should extend response with setHeader method', async () => {
      await extendResponse(scope, next);

      scope.response.setHeader('Content-Type', 'application/json');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(scope.set).toHaveBeenCalledWith('Content-Type', 'application/json');
    });

    test('response.setHeader should be chainable', async () => {
      await extendResponse(scope, next);

      const response = scope.response.setHeader('Content-Type', 'application/json');

      expect(response).toBe(scope.response);
    });

    test('it should extend response with withHeaders method', async () => {
      await extendResponse(scope, next);

      scope.response.withHeaders({
        'Content-Type': 'application/json',
        'X-Custom-Header': 'value',
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(scope.set).toHaveBeenCalledWith('Content-Type', 'application/json');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(scope.set).toHaveBeenCalledWith('X-Custom-Header', 'value');
    });

    test('response.withHeaders is chainable', async () => {
      await extendResponse(scope, next);

      const response = scope.response.withHeaders({
        'Content-Type': 'application/json',
        'X-Custom-Header': 'value',
      });

      expect(response).toBe(scope.response);
    });
  });
});
