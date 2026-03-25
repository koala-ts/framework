import { create } from '@/application/create-application';
import { koalaDefaultConfig } from '@/Config';
import { Get, Route, RouteGroup } from '@/routing';
import { exclusiveRoutingModeError } from '@/routing/verify-routing-mode';
import { expect, test } from 'vitest';

test('create app with default config', () => {
  const app = create(koalaDefaultConfig);

  expect(app).toBeDefined();
});

test('create app with explicit routes', () => {
  const app = create({
    ...koalaDefaultConfig,
    routes: [
      Route({
        method: 'GET',
        path: '/users',
        handler: async scope => {
          scope.response.body = [];
        },
      }),
    ],
  });

  expect(app).toBeDefined();
});

test('create app with grouped routes', () => {
  const app = create({
    ...koalaDefaultConfig,
    routes: [
      RouteGroup(
        {
          prefix: '/api',
        },
        () => [
          Get('/users', async scope => {
            scope.response.body = [];
          }),
        ],
      ),
    ],
  });

  expect(app).toBeDefined();
});

test('it rejects mixing legacy controllers and explicit routes', () => {
  class LegacyController {}

  expect(() =>
    create({
      ...koalaDefaultConfig,
      controllers: [LegacyController],
      routes: [
        Route({
          method: 'GET',
          path: '/users',
          handler: async scope => {
            scope.response.body = [];
          },
        }),
      ],
    }),
  ).toThrow(exclusiveRoutingModeError);
});
