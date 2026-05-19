import { describe, expect, it } from 'vitest';
import { ConstraintContext } from '@/validator/constraint-validator';
import { unique, UniqueOptions } from './unique';

describe('unique', () => {
  it('returns no violations when array elements are unique', () => {
    const value = ['7', 7, true];
    const context: ConstraintContext = createContext('tags', value, {} as UniqueOptions);

    const violations = unique(value, context);

    expect(violations).toHaveLength(0);
  });

  it('returns one violation when an array contains duplicate elements', () => {
    const value = ['admin', 'editor', 'admin'];
    const context: ConstraintContext = createContext('tags', value, {} as UniqueOptions);

    const violations = unique(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'tags',
      constraint: 'unique',
      message: 'This collection should contain only unique elements.',
      value,
    });
  });

  it('returns one violation when the value is not an array', () => {
    const value = 'admin';
    const context: ConstraintContext = createContext('tags', value, {} as UniqueOptions);

    const violations = unique(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'tags',
      constraint: 'unique',
      message: 'This collection should contain only unique elements.',
      value,
    });
  });

  it('should bypass undefined value', () => {
    const value = undefined;
    const context: ConstraintContext = createContext('tags', value, { message: 'Tags must be unique' });

    const violations = unique(value, context);

    expect(violations).toHaveLength(0);
  });

  it('uses a custom message when provided', () => {
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

  it('normalizes each array element before checking uniqueness', () => {
    const value = ['    admin ', 'admin'];
    const context: ConstraintContext = createContext('tags', value, {
      normalizer: (element: unknown) => (typeof element === 'string' ? element.trim() : element),
    });

    const violations = unique(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'tags',
      constraint: 'unique',
      message: 'This collection should contain only unique elements.',
      value,
    });
  });

  describe('checks uniqueness using the configured field combination', () => {
    it('with normalizer', () => {
      const value = [
        { latitude: 10, longitude: 20, label: '     first', name: 'first-location' },
        { latitude: 10, longitude: 20, label: 'first', name: 'last-location' },
      ];
      const context: ConstraintContext = createContext('coordinates', value, {
        fields: ['latitude', 'longitude', 'label'],
        normalizer: (element: unknown) => (typeof element === 'string' ? element.trim() : element),
      });

      const violations = unique(value, context);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'coordinates',
        constraint: 'unique',
        message: 'This collection should contain only unique elements.',
        value,
      });
    });

    it('without normalizer', () => {
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
        message: 'This collection should contain only unique elements.',
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
