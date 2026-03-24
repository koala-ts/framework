import { describe, expect, test, vi } from 'vitest';
import { Any, Delete, Get, Head, Options, Patch, Post, Put } from './http-verb-helpers';

describe('routing http verb helpers', () => {
  test.each([
    ['Get', Get, ['get']],
    ['Post', Post, ['post']],
    ['Put', Put, ['put']],
    ['Patch', Patch, ['patch']],
    ['Delete', Delete, ['delete']],
    ['Head', Head, ['head']],
    ['Options', Options, ['options']],
    ['Any', Any, ['all']],
  ])('it creates a %s route through the canonical route contract', (_name, helper, methods) => {
    const handler = vi.fn(async () => undefined);

    const route = helper('/users', handler);

    expect(route).toEqual({
      bodyOptions: {},
      handler,
      methods,
      middleware: [],
      parseBody: true,
      path: '/users',
    });
  });
});
