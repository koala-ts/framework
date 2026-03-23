import request from 'supertest';
import { beforeEach, expect, test, vi } from 'vitest';
import {
  create,
  getRoutes,
  koalaDefaultConfig,
  registerRoutes,
  Route,
  type HttpMiddleware,
  type HttpScope,
  type KoalaConfig,
} from '../src';

const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

beforeEach(() => {
  delete (globalThis as Record<symbol, unknown>)[routeRegistryKey];
});

test('registers collected routes on an application', async () => {
  Route({ method: 'get', path: '/registered-routes', options: { parseBody: false } })((scope: HttpScope) => {
    scope.response.body = { ok: true, source: 'registerRoutes' };
  });
  const app = create(koalaDefaultConfig);

  registerRoutes(app, getRoutes());
  const response = await request(app.callback()).get('/registered-routes');

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ ok: true, source: 'registerRoutes' });
});

test('creates an application from globally registered routes when config is empty', async () => {
  Route({ method: 'get', path: '/fallback-route', options: { parseBody: false } })((scope: HttpScope) => {
    scope.response.body = { ok: true, source: 'fallback' };
  });

  const app = create({} as KoalaConfig);
  const response = await request(app.callback()).get('/fallback-route');

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ ok: true, source: 'fallback' });
});

test('creates an application from a default route manifest', async () => {
  const app = create({
    routing: {
      routeManifest: 'tests/fixtures/route-modules/generated-default-route-manifest.ts',
    },
  } as KoalaConfig);
  const response = await request(app.callback()).get('/decorator-function-route');

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ ok: true, source: 'function' });
});

test('discovers nested routes and ignores test and type files', async () => {
  const app = create({
    routing: {
      routesDir: 'tests/fixtures/route-modules/discovery-filter',
    },
  } as KoalaConfig);

  const alphaResponse = await request(app.callback()).get('/alpha');
  const betaResponse = await request(app.callback()).get('/beta');

  expect(alphaResponse.status).toBe(200);
  expect(alphaResponse.body).toEqual({ ok: true, source: 'alpha' });
  expect(betaResponse.status).toBe(200);
  expect(betaResponse.body).toEqual({ ok: true, source: 'beta' });
});

test('fails with source details when configured route modules collide', () => {
  const createApplication = (): ReturnType<typeof create> =>
    create({
      routing: {
        routeModules: ['tests/fixtures/route-modules/duplicate-a.ts', 'tests/fixtures/route-modules/duplicate-b.ts'],
      },
    } as KoalaConfig);

  expect(createApplication).toThrowError(
    /Duplicate route detected for GET \/duplicate-route: .*duplicate-a\.ts and .*duplicate-b\.ts/,
  );
});

test('fails without source details when registered routes collide', () => {
  Route({ method: 'get', path: '/duplicate-fallback', options: { parseBody: false } })(
    vi.fn() as unknown as HttpMiddleware,
  );
  Route({ method: 'get', path: '/duplicate-fallback', options: { parseBody: false } })(
    vi.fn() as unknown as HttpMiddleware,
  );

  const createApplication = (): ReturnType<typeof create> => create({} as KoalaConfig);

  expect(createApplication).toThrowError('Duplicate route detected for GET /duplicate-fallback');
});
