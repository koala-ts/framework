import path from 'node:path';
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

  describe('Route modules', () => {
    test('resolves function route modules and ignores non route exports', () => {
      const routes = resolveConfiguredRoutes({
        routing: {
          routeModules: ['tests/fixtures/route-modules/mixed-exports.ts'],
        },
      });

      expect(routes).toEqual([
        {
          path: '/mixed-route',
          methods: ['get'],
          handler: expect.any(Function),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: path.resolve(process.cwd(), 'tests/fixtures/route-modules/mixed-exports.ts'),
        },
      ]);
    });
  });

  describe('Route manifests', () => {
    test('resolves route modules from a default manifest export', () => {
      const routes = resolveConfiguredRoutes({
        routing: {
          routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
        },
      });

      expect(routes).toEqual([
        {
          path: '/decorator-function-route',
          methods: ['get'],
          handler: expect.any(Function),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: path.resolve(process.cwd(), 'tests/fixtures/route-modules/function-route.ts'),
        },
      ]);
    });

    test('fails when the configured route manifest does not exist', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routeManifest: 'tests/fixtures/route-modules/missing-manifest.ts',
          },
        });

      expect(resolveRoutes).toThrow(
        `Route manifest does not exist: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/missing-manifest.ts')}`,
      );
    });

    test('fails when the configured route manifest shape is invalid', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routeManifest: 'tests/fixtures/route-modules/invalid-route-manifest.ts',
          },
        });

      expect(resolveRoutes).toThrow(
        `Route manifest must export a routeModules array: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/invalid-route-manifest.ts')}`,
      );
    });
  });

  describe('Routes directory discovery', () => {
    test('discovers supported route modules recursively and ignores test and type files', () => {
      const routes = resolveConfiguredRoutes({
        routing: {
          routesDir: 'tests/fixtures/route-modules/discovery-filter',
        },
      });

      expect(routes).toEqual([
        {
          path: '/alpha',
          methods: ['get'],
          handler: expect.any(Function),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: path.resolve(process.cwd(), 'tests/fixtures/route-modules/discovery-filter/alpha.ts'),
        },
        {
          path: '/beta',
          methods: ['get'],
          handler: expect.any(Function),
          parseBody: false,
          middleware: [],
          bodyOptions: {},
          source: path.resolve(process.cwd(), 'tests/fixtures/route-modules/discovery-filter/nested/beta.ts'),
        },
      ]);
    });

    test('fails when the configured routes directory does not exist', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routesDir: 'tests/fixtures/route-modules/missing-routes',
          },
        });

      expect(resolveRoutes).toThrow(
        `Routes directory does not exist: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/missing-routes')}`,
      );
    });
  });

  describe('Invalid routing configuration', () => {
    test('fails when route modules and routes directory are configured together', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routeModules: ['tests/fixtures/route-modules/function-route.ts'],
            routesDir: 'tests/fixtures/route-modules/discovery-filter',
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });

    test('fails when route modules and route manifest are configured together', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routeModules: ['tests/fixtures/route-modules/function-route.ts'],
            routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });

    test('fails when routes directory and route manifest are configured together', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routesDir: 'tests/fixtures/route-modules/discovery-filter',
            routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });

    test('fails when all routing sources are configured together', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routeModules: ['tests/fixtures/route-modules/function-route.ts'],
            routesDir: 'tests/fixtures/route-modules/discovery-filter',
            routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });

    test('fails when controllers and route modules are configured together', () => {
      class ArticlesController {
        @Route({ method: 'get', path: '/articles' })
        public list(): void {}
      }

      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          controllers: [ArticlesController],
          routing: {
            routeModules: ['tests/fixtures/route-modules/function-route.ts'],
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });

    test('fails when controllers and routes directory are configured together', () => {
      class ArticlesController {
        @Route({ method: 'get', path: '/articles' })
        public list(): void {}
      }

      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          controllers: [ArticlesController],
          routing: {
            routesDir: 'tests/fixtures/route-modules/discovery-filter',
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });

    test('fails when controllers and route manifest are configured together', () => {
      class ArticlesController {
        @Route({ method: 'get', path: '/articles' })
        public list(): void {}
      }

      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          controllers: [ArticlesController],
          routing: {
            routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
          },
        });

      expect(resolveRoutes).toThrow(
        'Invalid routing configuration: choose only one of controllers, routeModules, routesDir, or routeManifest.',
      );
    });
  });

  describe('Fallback behavior', () => {
    test('falls back to registered routes when no explicit route source is configured', () => {
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
    test('fails with route source details when explicit sources register duplicate routes', () => {
      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
        resolveConfiguredRoutes({
          routing: {
            routeModules: [
              'tests/fixtures/route-modules/duplicate-a.ts',
              'tests/fixtures/route-modules/duplicate-b.ts',
            ],
          },
        });

      expect(resolveRoutes).toThrow(
        `Duplicate route detected for GET /duplicate-route: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/duplicate-a.ts')} and ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/duplicate-b.ts')}`,
      );
    });

    test('fails without source details when registered routes collide', () => {
      Route({ method: 'get', path: '/duplicate-registered' })(vi.fn<HttpMiddleware>());
      Route({ method: 'get', path: '/duplicate-registered' })(vi.fn<HttpMiddleware>());

      const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> => resolveConfiguredRoutes({});

      expect(resolveRoutes).toThrow('Duplicate route detected for GET /duplicate-registered');
    });
  });
});
