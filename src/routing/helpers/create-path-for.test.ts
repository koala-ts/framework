import { describe, expect, test, vi } from 'vitest';
import { createPathFor } from './create-path-for';
import { Get } from './http-verb-helpers';

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
});
