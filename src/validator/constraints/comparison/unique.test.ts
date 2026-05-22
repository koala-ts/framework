import { ConstraintContext } from '@/validator/constraint-validator';
import { describe, expect, test } from 'vitest';
import { unique, UniqueOptions } from './unique';

describe('unique', () => {
  describe('non-array values', () => {
    test('validation passes when the value is undefined', () => {
      const value = undefined;
      const context: ConstraintContext = createContext('tags', value, { message: 'Tags must be unique' });

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when the value is null', () => {
      const value = null;
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must be a list.',
        value,
      });
    });

    test('validation fails when the value is not an array', () => {
      const value = 'admin';
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must be a list.',
        value,
      });
    });
  });

  describe('arrays of scalars', () => {
    test('validation passes when array elements are unique', () => {
      const value = ['7', 7, true, null, undefined];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation passes when the array contains a null value', () => {
      const value = [null];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation passes when the array contains an undefined value', () => {
      const value = [undefined];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when an array contains duplicate null values', () => {
      const value = [null, null];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });

    test('validation fails when an array contains duplicate undefined values', () => {
      const value = [undefined, undefined];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });

    test('validation fails when an array contains duplicate elements', () => {
      const value = ['admin', 'editor', 'admin'];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });
  });

  describe('arrays of arrays', () => {
    test('validation passes when nested arrays have different values', () => {
      const value = [['admin'], ['editor']];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when nested arrays have the same values', () => {
      const value = [['admin'], ['admin']];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });
  });

  describe('arrays of objects', () => {
    test('validation passes when objects have different values', () => {
      const value = [{ id: 1 }, { id: 2 }];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when objects have the same values', () => {
      const value = [{ id: 1 }, { id: 1 }];
      const context: ConstraintContext = createContext('tags', value, {});

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });

    test('validation passes when the configured field combinations are unique', () => {
      const value = [
        { latitude: 10, longitude: 20, label: 'first', name: 'first-location' },
        { latitude: 10, longitude: 30, label: 'first', name: 'last-location' },
      ];
      const context: ConstraintContext = createContext('coordinates', value, {
        fields: ['latitude', 'longitude', 'label'],
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when the configured field combinations contain duplicates', () => {
      const value = [
        { latitude: 10, longitude: 20, label: 'first', name: 'first-location' },
        { latitude: 10, longitude: 20, label: 'first', name: 'last-location' },
      ];
      const context: ConstraintContext = createContext('coordinates', value, {
        fields: ['latitude', 'longitude', 'label'],
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'coordinates',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });

    test('validation fails when fields are configured and an element is not an object', () => {
      const value = [{ id: 1 }, 'admin'];
      const context: ConstraintContext = createContext('tags', value, {
        fields: ['id'],
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must be a list of objects.',
        value,
      });
    });
  });

  describe('options', () => {
    test('validation uses a custom message when it fails', () => {
      const value = ['admin', 'admin'];
      const context: ConstraintContext = createContext('tags', value, { message: 'Tags must be unique' });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'Tags must be unique',
        value,
      });
    });

    test('validation normalizes each array element before checking uniqueness', () => {
      const value = ['    admin ', 'admin'];
      const context: ConstraintContext = createContext('tags', value, {
        normalizer: (element: unknown) => (typeof element === 'string' ? element.trim() : element),
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });

    test('validation normalizes each object before checking configured field combinations', () => {
      const value = [
        { latitude: 10, longitude: 20, label: '     first', name: 'first-location' },
        { latitude: 10, longitude: 20, label: 'first', name: 'last-location' },
      ];
      const context: ConstraintContext = createContext('coordinates', value, {
        fields: ['latitude', 'longitude', 'label'],
        normalizer: (element: unknown) =>
          typeof element === 'object' && element !== null && 'label' in element
            ? { ...element, label: String(element.label).trim() }
            : element,
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'coordinates',
        constraint: 'unique',
        message: 'This value must contain only unique items.',
        value,
      });
    });

    test('validation fails when fields are configured and normalization returns a non-object element', () => {
      const value = [{ id: 1 }, { id: 2 }];
      const context: ConstraintContext = createContext('tags', value, {
        fields: ['id'],
        normalizer: (element: unknown) =>
          typeof element === 'object' && element !== null && 'id' in element && element.id === 2 ? 'admin' : element,
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'unique',
        message: 'This value must be a list of objects.',
        value,
      });
    });
  });

  function createContext(path: string, value: unknown, options: UniqueOptions): ConstraintContext<UniqueOptions> {
    return {
      path,
      root: { [path]: value },
      value,
      constraint: 'unique',
      options,
      runNestedRules: () => [],
    };
  }
});
