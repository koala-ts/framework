import Koa from 'koa';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';
import { type Application } from '@/application/application';
import { registerRoutes } from './register-routes';
import { Route } from './route';

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
});
