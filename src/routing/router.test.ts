import { getRoutes, registerRoutes, Route } from '@/routing/router';
import Koa from 'koa';
import request from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
});

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
        handler: Foo.prototype.bar,
        path: '/foo',
        parseBody: false,
        middleware: [exampleMiddleware],
        bodyOptions: {},
      },
      {
        methods: ['get', 'post'],
        handler: Foo.prototype.routeWithMultipleMethods,
        path: '/route-with-multiple-methods',
        parseBody: true,
        middleware: [],
        bodyOptions: { multipart: true },
      },
      {
        methods: ['all'],
        handler: Foo.prototype.routeWithAnyMethod,
        path: '/route-with-any-method',
        parseBody: true,
        middleware: [],
        bodyOptions: {},
      },
      {
        methods: ['all'],
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
    vi.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

    expect(getRoutes()).toEqual([]);
  });
});

describe('registerRoutes', () => {
  test('it dispatches registered routes', async () => {
    const target = vi.fn(async ctx => {
      ctx.body = { ok: true };
    });
    Route({ path: '/registered-route', method: 'post', options: { parseBody: false } })(target, 'handler', {});
    const app = new Koa();

    app.use(registerRoutes());

    const response = await request(app.callback()).post('/registered-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(target).toHaveBeenCalledTimes(1);
  });

  test('it responds with allowed methods', async () => {
    const target = vi.fn(async ctx => {
      ctx.status = 204;
    });
    Route({ path: '/allowed-methods-route', method: 'get', options: { parseBody: false } })(target, 'handler', {});
    const app = new Koa();

    app.use(registerRoutes());

    const response = await request(app.callback()).post('/allowed-methods-route');

    expect(response.status).toBe(405);
    expect(response.headers.allow).toBe('HEAD, GET');
  });

  test('it builds the router once for multiple requests', async () => {
    const createRouterSpy = vi.spyOn(Reflect, 'getMetadata');
    const target = vi.fn(async ctx => {
      ctx.status = 204;
    });
    Route({ path: '/router-created-once', method: 'get', options: { parseBody: false } })(target, 'handler', {});
    const app = new Koa();

    app.use(registerRoutes());

    await request(app.callback()).get('/router-created-once');
    await request(app.callback()).get('/router-created-once');

    expect(createRouterSpy).toHaveBeenCalledTimes(2);
  });
});
