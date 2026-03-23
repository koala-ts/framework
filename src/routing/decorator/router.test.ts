import type { Application } from '@/application/application';
import type { KoalaConfig } from '@/Config';
import type { HttpMiddleware } from '@/Http';
import { attachRouteToTarget } from '@/routing/decorator/decorated-route';
import {
  createRouteDecorator,
  getRoutes,
  registerConfiguredRoutes,
  registerRouteDefinitions,
  registerRoutes,
} from '@/routing/decorator/router';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  routerCalls: [] as Array<{ method: string; path: string; middleware: unknown[] }>,
  routesMiddleware: vi.fn(),
  allowedMethodsMiddleware: vi.fn(),
  koaBodySpy: vi.fn((options?: unknown) => ({ options, type: 'koa-body-middleware' })),
}));

vi.mock('koa-body', () => ({
  koaBody: mockState.koaBodySpy,
}));

vi.mock('@koa/router', () => {
  class RouterMock {
    public get(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'get', path, middleware });

      return this;
    }

    public post(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'post', path, middleware });

      return this;
    }

    public put(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'put', path, middleware });

      return this;
    }

    public patch(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'patch', path, middleware });

      return this;
    }

    public delete(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'delete', path, middleware });

      return this;
    }

    public options(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'options', path, middleware });

      return this;
    }

    public head(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'head', path, middleware });

      return this;
    }

    public all(path: string, ...middleware: unknown[]): RouterMock {
      mockState.routerCalls.push({ method: 'all', path, middleware });

      return this;
    }

    public routes(): typeof mockState.routesMiddleware {
      return mockState.routesMiddleware;
    }

    public allowedMethods(): typeof mockState.allowedMethodsMiddleware {
      return mockState.allowedMethodsMiddleware;
    }
  }

  return {
    default: RouterMock,
  };
});

const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

beforeEach(() => {
  mockState.routerCalls.splice(0, mockState.routerCalls.length);
  mockState.koaBodySpy.mockClear();
  mockState.routesMiddleware.mockClear();
  mockState.allowedMethodsMiddleware.mockClear();
  delete (globalThis as Record<symbol, unknown>)[routeRegistryKey];
});

describe('createRouteDecorator', () => {
  test('returns the decorated handler for function targets', () => {
    const handler = vi.fn() as unknown as HttpMiddleware;
    const decorate = createRouteDecorator({ method: 'get', path: '/articles' });

    const decoratedHandler = decorate(handler);

    expect(decoratedHandler).toBe(handler);
  });

  test('returns undefined for method decorator targets', () => {
    class ArticlesController {
      public list(): void {}
    }

    const decorate = createRouteDecorator({ method: 'get', path: '/articles' });
    const descriptor = Object.getOwnPropertyDescriptor(ArticlesController.prototype, 'list')!;

    const result = decorate(ArticlesController.prototype, 'list', descriptor);

    expect(result).toBeUndefined();
  });
});

test('reads registered routes as route metadata', () => {
  const handler = vi.fn() as unknown as HttpMiddleware;

  attachRouteToTarget({ method: 'post', path: '/articles', options: { parseBody: false } }, handler);

  const routes = getRoutes();

  expect(routes).toEqual([
    {
      path: '/articles',
      methods: ['post'],
      handler,
      parseBody: false,
      middleware: [],
      bodyOptions: {},
      source: undefined,
    },
  ]);
});

test('registers route definitions on the application', () => {
  const app = { use: vi.fn() } as unknown as Application;
  const routeMiddleware = vi.fn() as unknown as HttpMiddleware;
  const handler = vi.fn() as unknown as HttpMiddleware;

  const result = registerRouteDefinitions(app, [
    {
      path: '/articles',
      methods: ['get', 'post'],
      handler,
      parseBody: true,
      middleware: [routeMiddleware],
      bodyOptions: { multipart: true },
    },
  ]);

  expect(result).toBe(app);
  expect(mockState.koaBodySpy).toHaveBeenCalledWith({ multipart: true });
  expect(mockState.routerCalls).toEqual([
    {
      method: 'get',
      path: '/articles',
      middleware: [{ options: { multipart: true }, type: 'koa-body-middleware' }, routeMiddleware, handler],
    },
    {
      method: 'post',
      path: '/articles',
      middleware: [{ options: { multipart: true }, type: 'koa-body-middleware' }, routeMiddleware, handler],
    },
  ]);
  expect(app.use).toHaveBeenNthCalledWith(1, mockState.routesMiddleware);
  expect(app.use).toHaveBeenNthCalledWith(2, mockState.allowedMethodsMiddleware);
});

test('registers route metadata without body parsing when disabled', () => {
  const app = { use: vi.fn() } as unknown as Application;
  const handler = vi.fn() as unknown as HttpMiddleware;

  const result = registerRoutes(app, [
    {
      path: '/articles',
      methods: ['delete'],
      handler,
      parseBody: false,
      middleware: [],
      bodyOptions: { multipart: true },
    },
  ]);

  expect(result).toBe(app);
  expect(mockState.koaBodySpy).not.toHaveBeenCalled();
  expect(mockState.routerCalls).toEqual([
    {
      method: 'delete',
      path: '/articles',
      middleware: [handler],
    },
  ]);
});

test('registers configured routes through the routing boundary', () => {
  const app = { use: vi.fn() } as unknown as Application;
  const handler = vi.fn() as unknown as HttpMiddleware;

  attachRouteToTarget({ method: 'get', path: '/configured-route', options: { parseBody: false } }, handler);

  const result = registerConfiguredRoutes(app, {} as KoalaConfig);

  expect(result).toBe(app);
  expect(mockState.routerCalls).toEqual([
    {
      method: 'get',
      path: '/configured-route',
      middleware: [handler],
    },
  ]);
});
