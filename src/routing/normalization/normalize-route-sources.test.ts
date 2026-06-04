import { Get } from '@/routing/declaration/http-verb-helpers';
import { RouteGroup } from '@/routing/declaration/route-group';
import { describe, expect, test, vi } from 'vitest';
import { normalizeRouteSources } from './normalize-route-sources';

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

  test('it treats a root group prefix as no prefix for non-root child paths', () => {
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          prefix: '/',
        },
        () => [Get('/users', handler)],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [],
        parseBody: true,
        path: '/users',
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

  test('it applies route overlays to direct child routes by local name', () => {
    const groupMiddleware = vi.fn(async () => undefined);
    const overlayMiddleware = vi.fn(async () => undefined);
    const routeMiddleware = vi.fn(async () => undefined);
    const handler = vi.fn(async () => undefined);
    const route = Get('/posts', 'create', handler);
    route.middleware = [routeMiddleware];

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          middleware: [groupMiddleware],
          routeConfig: {
            create: {
              middleware: [overlayMiddleware],
              options: {
                multipart: true,
                parseBody: false,
              },
            },
          },
        },
        () => [route],
      ),
    ]);

    expect(routes).toEqual([
      {
        ...route,
        middleware: [groupMiddleware, overlayMiddleware, routeMiddleware],
        parseBody: false,
        bodyOptions: {
          multipart: true,
        },
      },
    ]);
  });

  test('it does not apply parent route overlays to nested child routes', () => {
    const overlayMiddleware = vi.fn(async () => undefined);
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          routeConfig: {
            create: {
              middleware: [overlayMiddleware],
            },
          },
        },
        () => [
          RouteGroup(
            {
              prefix: '/posts',
            },
            () => [Get('/', 'create', handler)],
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
        name: 'create',
        parseBody: true,
        path: '/posts',
      },
    ]);
  });

  test('it keeps unnamed direct child routes unchanged when route config is present', () => {
    const overlayMiddleware = vi.fn(async () => undefined);
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          routeConfig: {
            create: {
              middleware: [overlayMiddleware],
            },
          },
        },
        () => [Get('/posts', handler)],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [],
        parseBody: true,
        path: '/posts',
      },
    ]);
  });

  test('it applies middleware-only route overlays without changing route options', () => {
    const overlayMiddleware = vi.fn(async () => undefined);
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          routeConfig: {
            create: {
              middleware: [overlayMiddleware],
            },
          },
        },
        () => [Get('/posts', 'create', handler)],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {},
        handler,
        methods: ['get'],
        middleware: [overlayMiddleware],
        name: 'create',
        parseBody: true,
        path: '/posts',
      },
    ]);
  });

  test('it applies options-only route overlays without changing middleware', () => {
    const handler = vi.fn(async () => undefined);

    const routes = normalizeRouteSources([
      RouteGroup(
        {
          routeConfig: {
            create: {
              options: {
                multipart: true,
                parseBody: false,
              },
            },
          },
        },
        () => [Get('/posts', 'create', handler)],
      ),
    ]);

    expect(routes).toEqual([
      {
        bodyOptions: {
          multipart: true,
        },
        handler,
        methods: ['get'],
        middleware: [],
        name: 'create',
        parseBody: false,
        path: '/posts',
      },
    ]);
  });
});
