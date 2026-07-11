import Koa from 'koa';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';
import type { Application } from '@/application/application';
import { Get } from '@/routing/declaration/http-verb-helpers';
import { Route } from '@/routing/declaration/route';
import { RouteGroup } from '@/routing/declaration/route-group';
import { registerRoutes } from './register-routes';

describe('register routes', () => {
  test('it registers a function-first route', async () => {
    const app = new Koa() as Application;

    registerRoutes(app, [
      Route({
        method: 'GET',
        path: '/users',
        handler: async scope => {
          scope.response.body = [{ id: 1 }];
        },
      }),
    ]);

    const response = await supertest(app.callback()).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it expands multiple methods and any routes', async () => {
    const app = new Koa() as Application;

    registerRoutes(app, [
      Route({
        method: ['GET', 'POST'],
        path: '/users',
        handler: async scope => {
          scope.response.body = { method: scope.request.method };
        },
      }),
      Route({
        method: 'ANY',
        path: '/fallback',
        handler: async scope => {
          scope.response.body = { method: scope.request.method };
        },
      }),
    ]);

    const getResponse = await supertest(app.callback()).get('/users');
    const postResponse = await supertest(app.callback()).post('/users');
    const patchResponse = await supertest(app.callback()).patch('/fallback');

    expect(getResponse.body).toEqual({ method: 'GET' });
    expect(postResponse.body).toEqual({ method: 'POST' });
    expect(patchResponse.body).toEqual({ method: 'PATCH' });
  });

  test('it applies route middleware and respects parseBody false', async () => {
    const app = new Koa() as Application;

    registerRoutes(app, [
      Route({
        method: 'POST',
        path: '/raw-body',
        middleware: [
          async (scope, next) => {
            scope.response.set('x-route-middleware', 'applied');
            await next();
          },
        ],
        options: { parseBody: false },
        handler: async scope => {
          scope.response.body = { bodyType: typeof scope.request.body };
        },
      }),
    ]);

    const response = await supertest(app.callback()).post('/raw-body').send({ name: 'Koala' });

    expect(response.headers['x-route-middleware']).toBe('applied');
    expect(response.body).toEqual({ bodyType: 'undefined' });
  });

  test('it rejects duplicate route signatures', () => {
    const app = new Koa() as Application;

    expect(() =>
      registerRoutes(app, [
        Route({
          method: 'GET',
          path: '/users',
          handler: async scope => {
            scope.response.body = [{ id: 1 }];
          },
        }),
        Route({
          method: 'GET',
          path: '/users',
          handler: async scope => {
            scope.response.body = [{ id: 2 }];
          },
        }),
      ]),
    ).toThrow('Duplicate route signature detected: GET /users.');
  });

  test('it rejects duplicate route names', () => {
    const app = new Koa() as Application;

    expect(() =>
      registerRoutes(app, [
        Route({
          name: 'users.list',
          method: 'GET',
          path: '/users',
          handler: async scope => {
            scope.response.body = [{ id: 1 }];
          },
        }),
        Route({
          name: 'users.list',
          method: 'POST',
          path: '/users',
          handler: async scope => {
            scope.response.body = [{ id: 2 }];
          },
        }),
      ]),
    ).toThrow('Duplicate route name detected: users.list.');
  });

  test('it registers grouped route sources through the modern registrar', async () => {
    const app = new Koa() as Application;

    registerRoutes(app, [
      RouteGroup(
        {
          prefix: '/api',
          namePrefix: 'api.',
        },
        () => [
          Get('/users', 'users.list', async scope => {
            scope.response.body = [{ id: 1 }];
          }),
        ],
      ),
    ]);

    const response = await supertest(app.callback()).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it rejects duplicate grouped route signatures after normalization', () => {
    const app = new Koa() as Application;

    expect(() =>
      registerRoutes(app, [
        RouteGroup(
          {
            prefix: '/api',
          },
          () => [Get('/users', async () => undefined)],
        ),
        RouteGroup(
          {
            prefix: '/api',
          },
          () => [Get('/users', async () => undefined)],
        ),
      ]),
    ).toThrow('Duplicate route signature detected: GET /api/users.');
  });
});
