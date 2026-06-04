import { describe, expect, test, vi } from 'vitest';
import { Route } from './route';

describe('routing route', () => {
  test('it creates a route definition for a single method', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({ method: 'GET', path: '/users', handler });

    expect(route).toEqual({
      path: '/users',
      methods: ['get'],
      handler,
      middleware: [],
      parseBody: true,
      bodyOptions: {},
    });
  });

  test('it creates a route definition with name middleware and body options', () => {
    const handler = vi.fn(async () => undefined);
    const middleware = [vi.fn(async () => undefined)];

    const route = Route({
      name: 'users.create',
      method: 'POST',
      path: '/users',
      handler,
      middleware,
      options: {
        multipart: true,
        parseBody: false,
      },
    });

    expect(route).toEqual({
      name: 'users.create',
      path: '/users',
      methods: ['post'],
      handler,
      middleware,
      parseBody: false,
      bodyOptions: {
        multipart: true,
      },
    });
  });

  test('it qualifies multiple methods', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({ method: ['GET', 'POST'], path: '/users', handler });

    expect(route.methods).toEqual(['get', 'post']);
  });

  test('it normalizes any and all to all', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({ method: ['ANY', 'ALL'], path: '/users', handler });

    expect(route.methods).toEqual(['all']);
  });

  test('it normalizes any with specific methods to all', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({ method: ['ANY', 'GET'], path: '/users', handler });

    expect(route.methods).toEqual(['all']);
  });

  test('it removes duplicate specific methods case insensitively', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({ method: ['GET', 'get', 'POST'], path: '/users', handler });

    expect(route.methods).toEqual(['get', 'post']);
  });
});
