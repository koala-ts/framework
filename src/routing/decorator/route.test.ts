import type { HttpMiddleware } from '@/Http';
import { getRouteDefinitionsFromHandler } from '@/routing/decorator/decorated-route';
import { all, any, del, get, head, options, patch, post, put } from '@/routing/decorator/route';
import { describe, expect, test, vi } from 'vitest';

describe('route', () => {
  test('creates a get route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    get('/articles', handler, { options: { parseBody: false } });

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['get']);
  });

  test('creates a post route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    post('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['post']);
  });

  test('creates a put route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    put('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['put']);
  });

  test('creates a patch route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    patch('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['patch']);
  });

  test('creates a delete route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    del('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['delete']);
  });

  test('creates an options route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    options('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['options']);
  });

  test('creates a head route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    head('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['head']);
  });

  test('creates an any route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    any('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['all']);
  });

  test('creates an all route with sugar', () => {
    const handler = vi.fn<HttpMiddleware>();

    all('/articles', handler);

    const definitions = getRouteDefinitionsFromHandler(handler);

    expect(definitions[0]?.methods).toEqual(['all']);
  });
});
