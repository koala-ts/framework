import { describe, expect, test, vi } from 'vitest';
import { Get } from './http-verb-helpers';
import { normalizeRouteSources } from './normalize-route-sources';
import { RouteGroup } from './route-group';

describe('normalize route sources', () => {
  test('it composes group prefixes and middleware into child routes', () => {
    const auth = vi.fn(async () => undefined);
    const routeMiddleware = vi.fn(async () => undefined);
    const handler = vi.fn(async () => undefined);
    const route = Get('/users', handler);
    route.middleware = [routeMiddleware];

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          prefix: '/api',
          middleware: [auth],
        },
        () => [route],
      ),
    ]);

    expect(routes).toEqual([
      {
        ...route,
        path: '/api/users',
        middleware: [auth, routeMiddleware],
      },
    ]);
  });

  test('it composes nested group prefixes and name prefixes', () => {
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          prefix: '/api',
          namePrefix: 'api.',
        },
        () => [
          RouteGroup(
            {
              prefix: '/posts',
              namePrefix: 'posts.',
            },
            () => [Get('/', 'list', handler)],
          ),
        ],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [],
        name: 'api.posts.list',
        parseBody: true,
        path: '/api/posts',
      },
    ]);
  });

  test('it keeps the root path when both group prefix and child path are empty roots', () => {
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          prefix: '/',
        },
        () => [Get('/', handler)],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [],
        parseBody: true,
        path: '/',
      },
    ]);
  });

  test('it keeps the normalized group prefix when the child path is empty', () => {
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          prefix: '/api/',
        },
        () => [
          {
            bodyOptions: {},
            handler,
            methods: ['get'],
            middleware: [],
            parseBody: true,
            path: '/',
          },
        ],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [],
        parseBody: true,
        path: '/api',
      },
    ]);
  });

  test('it keeps the parent prefix when a nested group omits its own prefix', () => {
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          prefix: '/api',
        },
        () => [RouteGroup({}, () => [Get('/users', handler)])],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [],
        parseBody: true,
        path: '/api/users',
      },
    ]);
  });
});
