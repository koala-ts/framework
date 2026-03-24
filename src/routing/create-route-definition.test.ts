import { describe, expect, test, vi } from 'vitest';
import { createRouteDefinition } from './create-route-definition';

describe('create route definition', () => {
  test('it creates a route definition from a single method', () => {
    const handler = vi.fn(async () => undefined);

    const routeDefinition = createRouteDefinition({
      method: 'GET',
      path: '/users',
      handler,
    });

    expect(routeDefinition).toEqual({
      bodyOptions: {},
      handler,
      methods: ['get'],
      middleware: [],
      parseBody: true,
      path: '/users',
    });
  });

  test('it creates a route definition from multiple methods', () => {
    const handler = vi.fn(async () => undefined);

    const routeDefinition = createRouteDefinition({
      method: ['GET', 'POST'],
      path: '/users',
      handler,
    });

    expect(routeDefinition.methods).toEqual(['get', 'post']);
  });

  test('it normalizes any and all to all', () => {
    const handler = vi.fn(async () => undefined);

    const routeDefinition = createRouteDefinition({
      method: ['ANY', 'all'],
      path: '/users',
      handler,
    });

    expect(routeDefinition.methods).toEqual(['all']);
  });

  test('it treats all as overriding specific methods', () => {
    const handler = vi.fn(async () => undefined);

    const routeDefinition = createRouteDefinition({
      method: ['ANY', 'GET'],
      path: '/users',
      handler,
    });

    expect(routeDefinition.methods).toEqual(['all']);
  });

  test('it removes duplicate specific methods', () => {
    const handler = vi.fn(async () => undefined);

    const routeDefinition = createRouteDefinition({
      method: ['GET', 'get', 'POST'],
      path: '/users',
      handler,
    });

    expect(routeDefinition.methods).toEqual(['get', 'post']);
  });

  test('it keeps request body options separate from the parse body flag', () => {
    const handler = vi.fn(async () => undefined);

    const routeDefinition = createRouteDefinition({
      method: 'POST',
      path: '/users',
      handler,
      options: { multipart: true, parseBody: false },
    });

    expect(routeDefinition).toMatchObject({
      bodyOptions: { multipart: true },
      parseBody: false,
    });
  });
});
