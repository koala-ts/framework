import { describe, expect, test } from 'vitest';
import { resolvePathTemplate } from './resolve-path-template';

describe('resolve path template', () => {
  test('it returns a static path unchanged', () => {
    const path = resolvePathTemplate('/users');

    expect(path).toBe('/users');
  });

  test('it replaces a path parameter with its value', () => {
    const path = resolvePathTemplate('/users/:id', { id: '42' });

    expect(path).toBe('/users/42');
  });

  test('it replaces multiple path parameters', () => {
    const path = resolvePathTemplate('/teams/:teamId/users/:userId', {
      teamId: 'alpha',
      userId: '42',
    });

    expect(path).toBe('/teams/alpha/users/42');
  });

  test('it throws when a required path parameter is missing', () => {
    expect(() => resolvePathTemplate('/users/:id')).toThrow('Missing required path parameter: id.');
  });
});
