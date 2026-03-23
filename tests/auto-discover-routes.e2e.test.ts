import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { autoDiscoverRoutes, create, type KoalaConfig } from '../src';

describe('Auto discover routes', () => {
  test('does not discover routes during sync app creation', async () => {
    const app = create({
      routing: {
        routeModules: ['tests/fixtures/route-modules/function-route.ts'],
      },
    } as KoalaConfig);

    const response = await request(app.callback()).get('/decorator-function-route');

    expect(response.status).toBe(404);
  });

  test('discovers route modules from explicit route modules config', async () => {
    const app = create({} as KoalaConfig);
    await autoDiscoverRoutes(app, {
      routeModules: ['tests/fixtures/route-modules/function-route.ts'],
    });

    const response = await request(app.callback()).get('/decorator-function-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'function' });
  });

  test('discovers route modules from a routes directory', async () => {
    const app = create({} as KoalaConfig);
    await autoDiscoverRoutes(app, {
      routesDir: 'tests/fixtures/route-modules/discovery-filter',
    });

    const alphaResponse = await request(app.callback()).get('/alpha');

    expect(alphaResponse.status).toBe(200);
    expect(alphaResponse.body).toEqual({ ok: true, source: 'alpha' });
  });

  test('discovers route modules from a route manifest', async () => {
    const app = create({} as KoalaConfig);
    await autoDiscoverRoutes(app, {
      routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
    });

    const response = await request(app.callback()).get('/decorator-function-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'function' });
  });

  test('fails when multiple discovery sources are configured together', async () => {
    const app = create({} as KoalaConfig);
    const discoverRoutes = (): ReturnType<typeof autoDiscoverRoutes> =>
      autoDiscoverRoutes(app, {
        routeModules: ['tests/fixtures/route-modules/function-route.ts'],
        routesDir: 'tests/fixtures/route-modules/discovery-filter',
      });

    await expect(discoverRoutes).rejects.toThrow(
      'Invalid routing configuration: choose only one of routeModules, routesDir, or routeManifest.',
    );
  });

  test('fails when discovered routes collide', async () => {
    const app = create({} as KoalaConfig);
    const discoverRoutes = (): ReturnType<typeof autoDiscoverRoutes> =>
      autoDiscoverRoutes(app, {
        routeModules: ['tests/fixtures/route-modules/duplicate-a.ts', 'tests/fixtures/route-modules/duplicate-b.ts'],
      });

    await expect(discoverRoutes).rejects.toThrow(
      /Duplicate route detected for GET \/duplicate-route: .*duplicate-a\.ts and .*duplicate-b\.ts/,
    );
  });
});
