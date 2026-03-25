import { describe, expect, test, vi } from 'vitest';
import { createPathFor } from './create-path-for';
import { Get } from './http-verb-helpers';
import { RouteGroup } from './route-group';

describe('create path for', () => {
  test('it creates a pure path resolver for named routes', () => {
    const pathFor = createPathFor([
      Get(
        '/users/:id',
        'users.show',
        vi.fn(async () => undefined),
      ),
    ]);

    const path = pathFor('users.show', { id: '42' });

    expect(path).toBe('/users/42');
  });

  test('it throws when the route name does not exist', () => {
    const pathFor = createPathFor([]);

    expect(() => pathFor('users.show')).toThrow('Unknown route name: users.show.');
  });

  test('it resolves grouped named routes using their normalized names', () => {
    const pathFor = createPathFor([
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
    ]);

    const path = pathFor('api.users.show', { id: '42' });

    expect(path).toBe('/api/users/42');
  });

  test('it resolves nested grouped route names', () => {
    const pathFor = createPathFor([
      RouteGroup(
        {
          prefix: '/api',
          namePrefix: 'api.',
        },
        () => [
          RouteGroup(
            {
              prefix: '/users',
              namePrefix: 'users.',
            },
            () => [
              Get(
                '/:id',
                'show',
                vi.fn(async () => undefined),
              ),
            ],
          ),
        ],
      ),
    ]);

    const path = pathFor('api.users.show', { id: '42' });

    expect(path).toBe('/api/users/42');
  });

  test('it throws when the named route requires a missing path parameter', () => {
    const pathFor = createPathFor([
      Get(
        '/users/:id',
        'users.show',
        vi.fn(async () => undefined),
      ),
    ]);

    expect(() => pathFor('users.show')).toThrow('Missing required path parameter: id.');
  });
});
