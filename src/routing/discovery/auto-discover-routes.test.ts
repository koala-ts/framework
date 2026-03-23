import { create } from '@/application/create-application';
import { autoDiscoverRoutes } from '@/routing/discovery/auto-discover-routes';
import request from 'supertest';
import { describe, expect, test } from 'vitest';

describe('Auto discover routes', () => {
  test('registers discovered routes on the application', async () => {
    const app = create({});

    await autoDiscoverRoutes(app, {
      routeModules: ['tests/fixtures/route-modules/function-route.ts'],
    });

    const response = await request(app.callback()).get('/decorator-function-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'function' });
  });
});
