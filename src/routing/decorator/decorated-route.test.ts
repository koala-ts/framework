import type { HttpMiddleware } from '@/Http';
import {
  attachRouteToTarget,
  getRegisteredRouteDefinitions,
  getRouteDefinitionsFromHandler,
  hasAttachedRouteMetadata,
} from '@/routing/decorator/decorated-route';
import { beforeEach, expect, test, vi } from 'vitest';

const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

beforeEach(() => {
  delete (globalThis as Record<symbol, unknown>)[routeRegistryKey];
});

test('attaches metadata to a function route', () => {
  const handler = vi.fn() as unknown as HttpMiddleware;

  attachRouteToTarget(
    {
      method: 'ANY',
      path: '/reports',
      middleware: [vi.fn() as unknown as HttpMiddleware],
      options: { parseBody: false, multipart: true },
    },
    handler,
  );

  const definitions = getRouteDefinitionsFromHandler(handler, 'reports.handler');

  expect(definitions).toEqual([
    {
      path: '/reports',
      methods: ['all'],
      handler,
      parseBody: false,
      middleware: expect.any(Array),
      bodyOptions: { multipart: true },
      source: 'reports.handler',
    },
  ]);
});

test('attaches metadata to a controller method', () => {
  class ReportsController {
    public list(): void {}
  }

  const target = ReportsController.prototype;

  attachRouteToTarget({ method: 'get', path: '/reports' }, target, 'list');

  const definitions = getRouteDefinitionsFromHandler(target.list);

  expect(definitions).toEqual([
    {
      path: '/reports',
      methods: ['get'],
      handler: target.list,
      parseBody: true,
      middleware: [],
      bodyOptions: {},
      source: undefined,
    },
  ]);
});

test('rejects unsupported decorator targets', () => {
  const attachRoute = (): HttpMiddleware => attachRouteToTarget({ method: 'get', path: '/reports' }, { value: 1 });

  expect(attachRoute).toThrowError('Route decorator can only be applied to functions or methods.');
});

test('reports when a handler has route metadata', () => {
  const handler = vi.fn() as unknown as HttpMiddleware;

  attachRouteToTarget({ method: 'all', path: '/reports' }, handler);

  expect(hasAttachedRouteMetadata(handler)).toBe(true);
});

test('returns no route definitions for non functions', () => {
  const definitions = getRouteDefinitionsFromHandler({ path: '/reports' }, 'reports.source');

  expect(definitions).toEqual([]);
});

test('returns false for values without attached metadata', () => {
  const hasMetadata = hasAttachedRouteMetadata({ path: '/reports' });

  expect(hasMetadata).toBe(false);
});

test('collects registered route definitions from attached handlers', () => {
  const firstHandler = vi.fn() as unknown as HttpMiddleware;
  const secondHandler = vi.fn() as unknown as HttpMiddleware;

  attachRouteToTarget({ method: 'GET', path: '/reports' }, firstHandler);
  attachRouteToTarget({ method: ['post', 'ALL'], path: '/reports/import' }, secondHandler);

  const definitions = getRegisteredRouteDefinitions();

  expect(definitions).toEqual([
    {
      path: '/reports',
      methods: ['get'],
      handler: firstHandler,
      parseBody: true,
      middleware: [],
      bodyOptions: {},
      source: undefined,
    },
    {
      path: '/reports/import',
      methods: ['post', 'all'],
      handler: secondHandler,
      parseBody: true,
      middleware: [],
      bodyOptions: {},
      source: undefined,
    },
  ]);
});
