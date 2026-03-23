import type { Controller, HttpMiddleware } from '@/index';
import { Route } from '@/routing/decorator/route';
import { resolveConfiguredRoutes } from '@/routing/resolve-routes';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

describe('Resolve configured routes', () => {
  beforeEach(() => {
    delete (globalThis as Record<symbol, unknown>)[routeRegistryKey];
  });

  describe('Controller routes', () => {
    test('resolves decorated routes from controllers', () => {
      class ArticlesController {
        @Route({ method: 'get', path: '/articles' })
        public list(): void {}

        public helper(): void {}
      }

      const routes = resolveConfiguredRoutes({ controllers: [ArticlesController] });

      expect(routes).toEqual([
        {
          path: '/articles',
          methods: ['get'],
          handler: ArticlesController.prototype.list,
          parseBody: true,
          middleware: [],
          bodyOptions: {},
          source: 'ArticlesController.list',
        },
      ]);
    });

    test('ignores invalid controller entries when resolving routes', () => {
      const invalidController = (() => null) as unknown as Controller;

      const routes = resolveConfiguredRoutes({ controllers: [invalidController] });

      expect(routes).toEqual([]);
    });
  });

  describe('Fallback behavior', () => {
    test('falls back to registered routes when no controllers are configured', () => {
      const handler = Route({ method: 'post', path: '/fallback', options: { parseBody: false } })(
        vi.fn<HttpMiddleware>(),
      );

      const routes = resolveConfiguredRoutes({});

      expect(routes).toEqual([
        {
          path: '/fallback',
          methods: ['post'],
          handler,
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: undefined,
        },
      ]);
    });
  });

  describe('Duplicate route detection', () => {
    test('fails without source details when registered routes collide', () => {
      Route({ method: 'get', path: '/duplicate-registered' })(vi.fn<HttpMiddleware>());
      Route({ method: 'get', path: '/duplicate-registered' })(vi.fn<HttpMiddleware>());

      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> => resolveConfiguredRoutes({});

      expect(resolveRoutes).toThrow('Duplicate route detected for GET /duplicate-registered');
    });
  });
});
