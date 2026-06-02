import { ConstraintContext } from '@/validator/constraint-validator';
import { Violation } from '@/validator/violation';
import { describe, expect, test, vi } from 'vitest';
import { all, AllOptions } from './all';

describe('all', () => {
  describe('non-array values', () => {
    test('validation passes when the value is undefined', () => {
      const value = undefined;
      const context = createContext('tags', value, { constraints: ['notBlank'] });

      const violations = all(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when the value is null', () => {
      const value = null;
      const context = createContext('tags', value, { constraints: ['notBlank'] });

      const violations = all(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'all',
        message: 'This value must be a list.',
        value,
      });
    });

    test('validation fails when the value is not an array', () => {
      const value = 'admin';
      const context = createContext('tags', value, { constraints: ['notBlank'] });

      const violations = all(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'all',
        message: 'This value must be a list.',
        value,
      });
    });
  });

  describe('array elements', () => {
    test('validation passes when every element passes nested constraints', () => {
      const value = ['admin', 'editor'];
      const context = createContext('tags', value, { constraints: ['notBlank'] });

      const violations = all(value, context);

      expect(violations).toHaveLength(0);
      expect(context.runNestedRules).toHaveBeenCalledWith('admin', ['notBlank'], 'tags[0]');
      expect(context.runNestedRules).toHaveBeenCalledWith('editor', ['notBlank'], 'tags[1]');
    });

    test('validation returns nested violations with indexed paths', () => {
      const value = ['', 'admin'];
      const context = createContext('tags', value, { constraints: ['notBlank'] });
      const violation = {
        path: 'tags[0]',
        constraint: 'notBlank',
        message: 'This value should not be blank.',
        value: '',
      };
      vi.mocked(context.runNestedRules).mockImplementation(element => (element === '' ? [violation] : []));

      const violations = all(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual(violation);
    });
  });

  describe('nested rules', () => {
    test('validation applies nested constraints from arrays', () => {
      const value = ['admin'];
      const context = createContext('tags', value, { constraints: ['notBlank'] });

      const violations = all(value, context);

      expect(context.runNestedRules).toHaveBeenCalledWith('admin', ['notBlank'], 'tags[0]');
      expect(violations).toHaveLength(0);
    });

    test('validation applies nested constraints from objects', () => {
      const value = ['Invalid Slug'];
      const context = createContext('slugs', value, { constraints: [{ slug: { message: 'Invalid slug' } }] });

      const violations = all(value, context);

      expect(context.runNestedRules).toHaveBeenCalledWith(
        'Invalid Slug',
        [{ slug: { message: 'Invalid slug' } }],
        'slugs[0]',
      );
      expect(violations).toHaveLength(0);
    });
  });

  function createContext(
    path: string,
    value: unknown,
    options: AllOptions,
    violations: Violation[] = [],
  ): ConstraintContext<AllOptions> {
    return {
      path,
      root: { [path]: value },
      value,
      constraint: 'all',
      options,
      runNestedRules: vi.fn(() => violations),
    };
  }
});
