import { describe, expect, test, vi } from 'vitest';
import { expandRouteDefinitions } from './expand-route-definitions';

describe('expand route definitions', () => {
  test('it expands route definitions into route registrations', () => {
    const handler = vi.fn(async () => undefined);

    const registrations = expandRouteDefinitions([
      {
        path: '/users',
        methods: ['get', 'post'],
        handler,
        middleware: [],
        parseBody: false,
        bodyOptions: {},
      },
    ]);

    expect(registrations).toEqual([
      {
        method: 'get',
        path: '/users',
        middleware: [handler],
      },
      {
        method: 'post',
        path: '/users',
        middleware: [handler],
      },
    ]);
  });

  test('it prepends koa body middleware when body parsing is enabled', () => {
    const handler = vi.fn(async () => undefined);

    const registrations = expandRouteDefinitions([
      {
        path: '/users',
        methods: ['post'],
        handler,
        middleware: [],
        parseBody: true,
        bodyOptions: { multipart: true },
      },
    ]);

    expect(registrations).toHaveLength(1);

    const registration = registrations[0];
    expect(registration).toBeDefined();
    expect(registration?.middleware).toHaveLength(2);
    expect(registration?.middleware[1]).toBe(handler);
  });
});
