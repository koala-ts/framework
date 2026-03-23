import { assertNoDuplicateRoutes } from '@/routing/discovery/assert-no-duplicate-routes';
import { describe, expect, test, vi } from 'vitest';
import type { HttpMiddleware } from '@/Http';

describe('Assert no duplicate routes', () => {
  test('fails with route source details when discovered routes collide', () => {
    const assertRoutes = (): void =>
      assertNoDuplicateRoutes([
        {
          path: '/duplicate-route',
          methods: ['get'],
          handler: vi.fn<HttpMiddleware>(),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: '/tmp/duplicate-a.ts',
        },
        {
          path: '/duplicate-route',
          methods: ['get'],
          handler: vi.fn<HttpMiddleware>(),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: '/tmp/duplicate-b.ts',
        },
      ]);

    expect(assertRoutes).toThrow(
      'Duplicate route detected for GET /duplicate-route: /tmp/duplicate-a.ts and /tmp/duplicate-b.ts',
    );
  });

  test('fails without source details when routes collide', () => {
    const assertRoutes = (): void =>
      assertNoDuplicateRoutes([
        {
          path: '/duplicate-route',
          methods: ['get'],
          handler: vi.fn<HttpMiddleware>(),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: undefined,
        },
        {
          path: '/duplicate-route',
          methods: ['get'],
          handler: vi.fn<HttpMiddleware>(),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: undefined,
        },
      ]);

    expect(assertRoutes).toThrow('Duplicate route detected for GET /duplicate-route');
  });
});
