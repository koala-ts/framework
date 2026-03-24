import { describe, expect, test, vi } from 'vitest';
import { Route } from './route';

describe('routing route', () => {
  test('it creates a function first route definition', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({
      method: 'GET',
      path: '/users',
      handler,
    });

    expect(route).toEqual({
      bodyOptions: {},
      handler,
      methods: ['get'],
      middleware: [],
      parseBody: true,
      path: '/users',
    });
  });

  test('it keeps the route name when provided', () => {
    const handler = vi.fn(async () => undefined);

    const route = Route({
      name: 'users.list',
      method: 'GET',
      path: '/users',
      handler,
    });

    expect(route.name).toBe('users.list');
  });
});
