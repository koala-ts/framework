import { describe, expect, test } from 'vitest';
import { createPathTemplateResolver, resolvePathTemplate } from './resolve-path-template';

describe('resolve path template', () => {
  describe('path resolution', () => {
    test('it returns a static path unchanged', () => {
      const path = resolvePathTemplate('/users');

      expect(path).toBe('/users');
    });

    test('it returns an empty path template unchanged', () => {
      const path = resolvePathTemplate('');

      expect(path).toBe('');
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

    test('it resolves a template that starts with a path parameter', () => {
      const path = resolvePathTemplate(':id/details', { id: '42' });

      expect(path).toBe('42/details');
    });

    test('it creates a reusable resolver for a path template', () => {
      const resolvePath = createPathTemplateResolver('/teams/:teamId/users/:userId');

      const path = resolvePath({
        teamId: 'alpha',
        userId: '42',
      });

      expect(path).toBe('/teams/alpha/users/42');
    });
  });

  describe('errors', () => {
    test('it throws when a required path parameter is missing', () => {
      const act = () => resolvePathTemplate('/users/:id');

      expect(act).toThrow('Missing required path parameter: id.');
    });
  });
});
