import type { HttpMiddleware } from '@/Http';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';
import { describe, expect, test, vi } from 'vitest';
import type { RouteDefinition } from './route-definition';
import { toRouteDefinition, toRouteMetadata } from './route-definition';

describe('route-definition', () => {
  test('converts route metadata into a route definition', () => {
    const handler = vi.fn<HttpMiddleware>();
    const middleware = [vi.fn<HttpMiddleware>()];
    const route: RouteMetadata = {
      path: '/articles',
      methods: ['post'],
      handler,
      parseBody: false,
      middleware,
      bodyOptions: { multipart: true },
      source: 'controller.create',
    };

    const definition = toRouteDefinition(route);

    expect(definition).toEqual({
      path: '/articles',
      methods: ['post'],
      handler,
      parseBody: false,
      middleware,
      bodyOptions: { multipart: true },
      source: 'controller.create',
    });
  });

  test('converts a route definition back into route metadata', () => {
    const handler = vi.fn<HttpMiddleware>();
    const middleware = [vi.fn<HttpMiddleware>()];
    const route: RouteDefinition = {
      path: '/articles',
      methods: ['get'],
      handler,
      parseBody: true,
      middleware,
      bodyOptions: { jsonLimit: '2mb' },
      source: 'routes/articles.ts',
    };

    const metadata = toRouteMetadata(route);

    expect(metadata).toEqual({
      path: '/articles',
      methods: ['get'],
      handler,
      parseBody: true,
      middleware,
      bodyOptions: { jsonLimit: '2mb' },
      source: 'routes/articles.ts',
    });
  });
});
