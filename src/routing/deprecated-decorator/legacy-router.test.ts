import Koa from 'koa';
import supertest from 'supertest';
import { afterEach, describe, expect, test } from 'vitest';
import type { Application } from '@/application/application';
import { getLegacyRouteDefinitions, getLegacyRoutes, registerLegacyRoutes } from './legacy-router';
import { Route } from './route';

const getMethodDescriptor = (prototype: object, methodName: string): PropertyDescriptor => {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);

  if (!descriptor) {
    throw new Error(`Expected ${methodName} descriptor`);
  }

  return descriptor;
};

describe('legacy router', () => {
  afterEach(() => {
    getLegacyRoutes().length = 0;
  });

  test('it converts decorated routes into route definitions', () => {
    class UsersController {
      list(): void {}
    }

    Route({ method: ['GET', 'POST'], path: '/users', options: { parseBody: false } })(
      UsersController.prototype,
      'list',
      getMethodDescriptor(UsersController.prototype, 'list'),
    );

    const routeDefinitions = getLegacyRouteDefinitions();

    expect(routeDefinitions).toEqual([
      expect.objectContaining({
        bodyOptions: {},
        methods: ['get', 'post'],
        parseBody: false,
        path: '/users',
      }),
    ]);
  });

  test('it registers normalized legacy routes through the shared route registrar', async () => {
    class UsersController {
      list(scope: { response: { body: unknown } }): void {
        scope.response.body = [{ id: 1 }];
      }
    }

    Route({ method: 'GET', path: '/users' })(
      UsersController.prototype,
      'list',
      getMethodDescriptor(UsersController.prototype, 'list'),
    );

    const app = new Koa() as Application;

    registerLegacyRoutes(app);

    const response = await supertest(app.callback()).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });
});
