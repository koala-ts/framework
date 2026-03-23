import { assertValidDiscoveryConfig, selectDiscoverySource } from '@/routing/discovery/discovery-config';
import { describe, expect, test } from 'vitest';

describe('Discovery config', () => {
  test('selects route modules as the discovery source', () => {
    const source = selectDiscoverySource({
      routeModules: ['tests/fixtures/route-modules/function-route.ts'],
    });

    expect(source).toEqual({
      kind: 'route-modules',
      routeModules: ['tests/fixtures/route-modules/function-route.ts'],
    });
  });

  test('selects the registered fallback when no discovery source is configured', () => {
    const source = selectDiscoverySource({});

    expect(source).toEqual({ kind: 'registered' });
  });

  test('fails when multiple discovery sources are configured together', () => {
    const assertConfig = (): void =>
      assertValidDiscoveryConfig({
        routeModules: ['tests/fixtures/route-modules/function-route.ts'],
        routesDir: 'tests/fixtures/route-modules/discovery-filter',
      });

    expect(assertConfig).toThrow(
      'Invalid routing configuration: choose only one of routeModules, routesDir, or routeManifest.',
    );
  });
});
