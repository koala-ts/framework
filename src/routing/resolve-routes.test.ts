import path from 'node:path';
import type { Controller, HttpMiddleware } from '@/index';
import { Route } from '@/routing/decorator/route';
import { resolveConfiguredRoutes } from '@/routing/resolve-routes';
import { beforeEach, expect, test, vi } from 'vitest';

const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

beforeEach(() => {
  delete (globalThis as Record<symbol, unknown>)[routeRegistryKey];
});

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

test('resolves function route modules and ignores non route exports', () => {
  const routes = resolveConfiguredRoutes({
    routeModules: ['tests/fixtures/route-modules/mixed-exports.ts'],
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

test('resolves route modules from a default manifest export', () => {
  const routes = resolveConfiguredRoutes({
    routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
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
    resolveConfiguredRoutes({ routeManifest: 'tests/fixtures/route-modules/missing-manifest.ts' });

  expect(resolveRoutes).toThrowError(
    `Route manifest does not exist: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/missing-manifest.ts')}`,
  );
});

test('fails when the configured route manifest shape is invalid', () => {
  const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
    resolveConfiguredRoutes({ routeManifest: 'tests/fixtures/route-modules/invalid-route-manifest.ts' });

  expect(resolveRoutes).toThrowError(
    `Route manifest must export a routeModules array: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/invalid-route-manifest.ts')}`,
  );
});

test('discovers supported route modules recursively and ignores test and type files', () => {
  const routes = resolveConfiguredRoutes({
    routesDir: 'tests/fixtures/route-modules/discovery-filter',
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
    resolveConfiguredRoutes({ routesDir: 'tests/fixtures/route-modules/missing-routes' });

  expect(resolveRoutes).toThrowError(
    `Routes directory does not exist: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/missing-routes')}`,
  );
});

test('falls back to registered routes when no explicit route source is configured', () => {
  const handler = Route({ method: 'post', path: '/fallback', options: { parseBody: false } })(
    vi.fn() as unknown as HttpMiddleware,
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

test('fails with route source details when explicit sources register duplicate routes', () => {
  const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> =>
    resolveConfiguredRoutes({
      routeModules: ['tests/fixtures/route-modules/duplicate-a.ts', 'tests/fixtures/route-modules/duplicate-b.ts'],
    });

  expect(resolveRoutes).toThrowError(
    `Duplicate route detected for GET /duplicate-route: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/duplicate-a.ts')} and ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/duplicate-b.ts')}`,
  );
});

test('fails without source details when registered routes collide', () => {
  Route({ method: 'get', path: '/duplicate-registered' })(vi.fn() as unknown as HttpMiddleware);
  Route({ method: 'get', path: '/duplicate-registered' })(vi.fn() as unknown as HttpMiddleware);

  const resolveRoutes = (): ReturnType<typeof resolveConfiguredRoutes> => resolveConfiguredRoutes({});

  expect(resolveRoutes).toThrowError('Duplicate route detected for GET /duplicate-registered');
});
