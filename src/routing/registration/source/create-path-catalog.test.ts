import { RouteGroup } from '@/routing/group/route-group';
import { Route } from '@/routing/route/route';
import { Get } from '@/routing/verb/http-verb-helpers';
import { describe, expect, test, vi } from 'vitest';
import { createPathCatalog } from './create-path-catalog';

describe('create path catalog', () => {
  test('it collects named route paths from route sources', () => {
    const routes = [
      Get(
        '/users',
        'users.index',
        vi.fn(async () => undefined),
      ),
      Route({
        name: 'users.show',
        method: 'GET',
        path: '/users/:id',
        handler: vi.fn(async () => undefined),
      }),
    ];

    const catalog = createPathCatalog(routes);

    expect(catalog).toEqual(
      new Map([
        ['users.index', '/users'],
        ['users.show', '/users/:id'],
      ]),
    );
  });

  test('it collects grouped route names using their normalized paths', () => {
    const routes = [
      RouteGroup(
        {
          prefix: '/api',
          namePrefix: 'api.',
        },
        () => [
          Get(
            '/users/:id',
            'users.show',
            vi.fn(async () => undefined),
          ),
        ],
      ),
    ];

    const catalog = createPathCatalog(routes);

    expect(catalog).toEqual(new Map([['api.users.show', '/api/users/:id']]));
  });

  test('it ignores unnamed routes', () => {
    const routes = [
      Get(
        '/users',
        vi.fn(async () => undefined),
      ),
      Get(
        '/users/:id',
        'users.show',
        vi.fn(async () => undefined),
      ),
    ];

    const catalog = createPathCatalog(routes);

    expect(catalog).toEqual(new Map([['users.show', '/users/:id']]));
  });

  test('it throws when normalized route names are duplicated', () => {
    const routes = [
      RouteGroup(
        {
          prefix: '/api',
          namePrefix: 'api.',
        },
        () => [
          Get(
            '/users',
            'users.index',
            vi.fn(async () => undefined),
          ),
        ],
      ),
      Route({
        name: 'api.users.index',
        method: 'GET',
        path: '/members',
        handler: vi.fn(async () => undefined),
      }),
    ];

    const createCatalog = () => createPathCatalog(routes);

    expect(createCatalog).toThrow('Duplicate route name detected: api.users.index.');
  });
});
