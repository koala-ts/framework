import { expect, test } from 'vitest';
import { create } from '#koala/application/create-application';
import { koalaDefaultConfig } from '#koala/config/default-config';
import { exclusiveRoutingModeError } from '#koala/routing/deprecated-decorator/verify-routing-mode';
import { Get, Route, RouteGroup } from '#koala/routing/index';

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
