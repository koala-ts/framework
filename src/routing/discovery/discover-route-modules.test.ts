import { discoverRouteModules } from '@/routing/discovery/discover-route-modules';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('Discover route modules', () => {
  test('discovers supported route modules recursively and ignores test and type files', () => {
    const routeModules = discoverRouteModules('tests/fixtures/route-modules/discovery-filter');

    expect(routeModules).toEqual([
      path.resolve(process.cwd(), 'tests/fixtures/route-modules/discovery-filter/alpha.ts'),
      path.resolve(process.cwd(), 'tests/fixtures/route-modules/discovery-filter/nested/beta.ts'),
    ]);
  });

  test('returns an empty list when no routes directory is configured', () => {
    const routeModules = discoverRouteModules();

    expect(routeModules).toEqual([]);
  });

  test('fails when the configured routes directory does not exist', () => {
    const discoverModules = (): ReturnType<typeof discoverRouteModules> =>
      discoverRouteModules('tests/fixtures/route-modules/missing-routes');

    expect(discoverModules).toThrow(
      `Routes directory does not exist: ${path.resolve(process.cwd(), 'tests/fixtures/route-modules/missing-routes')}`,
    );
  });
});
