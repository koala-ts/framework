import { describe, expect, test, vi } from 'vitest';
import { validateRouteDefinitions } from './validate-route-definitions';

describe('validate route definitions', () => {
  test('it rejects duplicate route signatures', () => {
    const handler = vi.fn(async () => undefined);

    expect(() =>
      validateRouteDefinitions(
        [
          {
            path: '/users',
            methods: ['get'],
            handler,
            middleware: [],
            parseBody: false,
            bodyOptions: {},
          },
          {
            path: '/users',
            methods: ['get'],
            handler,
            middleware: [],
            parseBody: false,
            bodyOptions: {},
          },
        ],
        [
          {
            method: 'get',
            path: '/users',
            middleware: [handler],
          },
          {
            method: 'get',
            path: '/users',
            middleware: [handler],
          },
        ],
      ),
    ).toThrow('Duplicate route signature detected: GET /users.');
  });

  test('it rejects duplicate route names', () => {
    const handler = vi.fn(async () => undefined);

    expect(() =>
      validateRouteDefinitions(
        [
          {
            name: 'users.list',
            path: '/users',
            methods: ['get'],
            handler,
            middleware: [],
            parseBody: false,
            bodyOptions: {},
          },
          {
            name: 'users.list',
            path: '/admins',
            methods: ['get'],
            handler,
            middleware: [],
            parseBody: false,
            bodyOptions: {},
          },
        ],
        [
          {
            method: 'get',
            path: '/users',
            middleware: [handler],
          },
          {
            method: 'get',
            path: '/admins',
            middleware: [handler],
          },
        ],
      ),
    ).toThrow('Duplicate route name detected: users.list.');
  });

  test('it allows unique route names and signatures', () => {
    const handler = vi.fn(async () => undefined);

    expect(() =>
      validateRouteDefinitions(
        [
          {
            name: 'users.list',
            path: '/users',
            methods: ['get'],
            handler,
            middleware: [],
            parseBody: false,
            bodyOptions: {},
          },
          {
            name: 'admins.list',
            path: '/admins',
            methods: ['get'],
            handler,
            middleware: [],
            parseBody: false,
            bodyOptions: {},
          },
        ],
        [
          {
            method: 'get',
            path: '/users',
            middleware: [handler],
          },
          {
            method: 'get',
            path: '/admins',
            middleware: [handler],
          },
        ],
      ),
    ).not.toThrow();
  });
});
