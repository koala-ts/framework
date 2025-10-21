import { describe, expect, test, vi } from 'vitest';
import { getRoutes, Route } from '@/Routing/Router';

describe('Route', () => {
  const exampleMiddleware = vi.fn();

  class Foo {
    @Route({
      method: 'get',
      path: '/foo',
      middleware: [exampleMiddleware],
      options: { parseBody: false },
    })
    bar(): void {
      // empty
    }

    @Route({
      method: ['get', 'post'],
      path: '/route-with-multiple-methods',
      options: { multipart: true },
    })
    routeWithMultipleMethods(): void {
      // empty
    }

    @Route({
      method: 'any',
      path: '/route-with-any-method',
    })
    routeWithAnyMethod(): void {
      // empty
    }

    @Route({
      method: 'all',
      path: '/route-with-all-method',
    })
    routeWithAllMethod(): void {
      // empty
    }
  }

  test('it should track registered routes', () => {
    expect(getRoutes()).toEqual([
      {
        methods: ['get'],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        handler: Foo.prototype.bar,
        path: '/foo',
        parseBody: false,
        middleware: [exampleMiddleware],
        bodyOptions: {},
      },
      {
        methods: ['get', 'post'],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        handler: Foo.prototype.routeWithMultipleMethods,
        path: '/route-with-multiple-methods',
        parseBody: true,
        middleware: [],
        bodyOptions: { multipart: true },
      },
      {
        methods: ['all'],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        handler: Foo.prototype.routeWithAnyMethod,
        path: '/route-with-any-method',
        parseBody: true,
        middleware: [],
        bodyOptions: {},
      },
      {
        methods: ['all'],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        handler: Foo.prototype.routeWithAllMethod,
        path: '/route-with-all-method',
        parseBody: true,
        middleware: [],
        bodyOptions: {},
      },
    ]);
  });

  test('it handles functions as handlers', () => {
    const target = vi.fn();
    Route({ path: '/fn-path', method: 'any' })(target, 'fn', {});

    const routes = getRoutes();

    expect(routes).toContainEqual({
      methods: ['all'],
      handler: target,
      middleware: [],
      parseBody: true,
      path: '/fn-path',
      bodyOptions: {},
    });
  });

  test('empty routes', () => {
    Reflect.getMetadata = vi.fn(() => undefined);

    expect(getRoutes()).toEqual([]);
  });
});
