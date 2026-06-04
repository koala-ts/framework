import { Get } from '@/routing/declaration/http-verb-helpers';
import { describe, expect, test, vi } from 'vitest';
import { RouteGroup } from '../declaration/route-group';
import { createPathFor } from './create-path-for';

describe('create path for', () => {
  describe('path resolution', () => {
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
  });

  describe('errors', () => {
    test('it throws when the route name does not exist', () => {
      const pathFor = createPathFor([]);

      const act = () => pathFor('users.show');

      expect(act).toThrow('Unknown route name: users.show.');
    });

    test('it throws when the named route requires a missing path parameter', () => {
      const pathFor = createPathFor([
        Get(
          '/users/:id',
          'users.show',
          vi.fn(async () => undefined),
        ),
      ]);

      const act = () => pathFor('users.show');

      expect(act).toThrow('Missing required path parameter: id.');
    });
  });
});
