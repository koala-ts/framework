import type { HttpMiddleware } from '@/Http';
import {
  attachRouteToTarget,
  getRegisteredRouteDefinitions,
  getRouteDefinitionsFromHandler,
  hasAttachedRouteMetadata,
} from '@/routing/decorator/decorated-route';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const routeRegistryKey = Symbol.for('@koala-ts/framework/route-registry');

describe('Decorated routes', () => {
  beforeEach(() => {
    delete (globalThis as Record<symbol, unknown>)[routeRegistryKey];
  });

  describe('Attaching route metadata', () => {
    test('attaches metadata to a function route', () => {
      const handler = vi.fn<HttpMiddleware>();
      const middleware = [vi.fn<HttpMiddleware>()];

      attachRouteToTarget(
        {
          method: 'ANY',
          path: '/reports',
          middleware,
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
          middleware,
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
      expect(attachRoute).toThrow('Route decorator can only be applied to functions or methods.');
    });
  });

  describe('Checking attached metadata', () => {
    test('reports when a handler has route metadata', () => {
      const handler = vi.fn<HttpMiddleware>();

      attachRouteToTarget({ method: 'all', path: '/reports' }, handler);

      const hasMetadata = hasAttachedRouteMetadata(handler);

      expect(hasMetadata).toBe(true);
    });

    test('returns false for values without attached metadata', () => {
      const value = { path: '/reports' };

      const hasMetadata = hasAttachedRouteMetadata(value);

      expect(hasMetadata).toBe(false);
    });
  });

  describe('Reading route definitions from handlers', () => {
    test('returns no route definitions for non functions', () => {
      const value = { path: '/reports' };

      const definitions = getRouteDefinitionsFromHandler(value, 'reports.source');

      expect(definitions).toEqual([]);
    });
  });

  describe('Reading registered route definitions', () => {
    test('collects registered route definitions from attached handlers', () => {
      const firstHandler = vi.fn<HttpMiddleware>();
      const secondHandler = vi.fn<HttpMiddleware>();

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
  });
});
