import { loadRouteManifestModules, loadRouteModuleDefinitions } from '@/routing/discovery/load-route-modules';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('Load route modules', () => {
  test('loads route definitions from explicit route modules and ignores non route exports', async () => {
    const routes = await loadRouteModuleDefinitions(['tests/fixtures/route-modules/mixed-exports.ts']);

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

  test('loads route modules from a manifest default export', async () => {
    const routeModules = await loadRouteManifestModules(
      'tests/fixtures/route-modules/generated-default-route-manifest.ts',
    );

    expect(routeModules).toEqual([path.resolve(process.cwd(), 'tests/fixtures/route-modules/function-route.ts')]);
  });

  test('fails when the configured route manifest does not exist', async () => {
    const loadManifest = (): ReturnType<typeof loadRouteManifestModules> =>
      loadRouteManifestModules('tests/fixtures/route-modules/missing-manifest.ts');

    await expect(loadManifest).rejects.toThrow(
      `Route manifest does not exist: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/missing-manifest.ts')}`,
    );
  });

  test('fails when the configured route manifest shape is invalid', async () => {
    const loadManifest = (): ReturnType<typeof loadRouteManifestModules> =>
      loadRouteManifestModules('tests/fixtures/route-modules/invalid-route-manifest.ts');

    await expect(loadManifest).rejects.toThrow(
      `Route manifest must export a routeModules array: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/invalid-route-manifest.ts')}`,
    );
  });
});
