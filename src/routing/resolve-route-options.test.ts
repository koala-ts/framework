import { describe, expect, test } from 'vitest';
import { mergeRouteOptions, resolveRouteOptions } from './resolve-route-options';

describe('resolve route options', () => {
  test('it resolves route definition options from route options', () => {
    const routeOptions = resolveRouteOptions({
      multipart: true,
      parseBody: false,
    });

    expect(routeOptions).toEqual({
      parseBody: false,
      bodyOptions: {
        multipart: true,
      },
    });
  });

  test('it merges overlay options into an existing route definition', () => {
    const routeOptions = mergeRouteOptions(
      {
        path: '/users',
        methods: ['post'],
        handler: async () => undefined,
        middleware: [],
        parseBody: true,
        bodyOptions: {
          jsonLimit: '1mb',
        },
      },
      {
        multipart: true,
        parseBody: false,
      },
    );

    expect(routeOptions).toEqual({
      parseBody: false,
      bodyOptions: {
        jsonLimit: '1mb',
        multipart: true,
      },
    });
  });

  test('it keeps the current parse body setting when the overlay omits it', () => {
    const routeOptions = mergeRouteOptions(
      {
        path: '/users',
        methods: ['post'],
        handler: async () => undefined,
        middleware: [],
        parseBody: false,
        bodyOptions: {
          jsonLimit: '1mb',
        },
      },
      {
        multipart: true,
      },
    );

    expect(routeOptions).toEqual({
      parseBody: false,
      bodyOptions: {
        jsonLimit: '1mb',
        multipart: true,
      },
    });
  });
});
