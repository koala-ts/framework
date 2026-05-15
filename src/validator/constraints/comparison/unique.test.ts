import { describe, expect, it } from 'vitest';
import { ConstraintContext } from '@/validator/constraint-validator';
import { unique } from './unique';

describe('unique', () => {
  it('returns no violations when array elements are unique', () => {
    const value = ['7', 7, true];
    const context: ConstraintContext = {
      path: 'tags',
      root: { tags: value },
      value,
      constraint: 'unique',
      options: {},
      runNestedRules: () => [],
    };

    const violations = unique(value, context);

    expect(violations).toHaveLength(0);
  });

  it('returns one violation when an array contains duplicate elements', () => {
    const value = ['admin', 'editor', 'admin'];
    const context: ConstraintContext = {
      path: 'tags',
      root: { tags: value },
      value,
      constraint: 'unique',
      options: {},
      runNestedRules: () => [],
    };

    const violations = unique(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'tags',
      constraint: 'unique',
      message: 'This collection should contain only unique elements.',
      value,
    });
  });

  it('uses a custom message when provided', () => {
    const value = ['admin', 'admin'];
    const context: ConstraintContext = {
      path: 'tags',
      root: { tags: value },
      value,
      constraint: 'unique',
      options: { message: 'Tags must be unique' },
      runNestedRules: () => [],
    };

    const violations = unique(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'tags',
      constraint: 'unique',
      message: 'Tags must be unique',
      value,
    });
  });

  it('returns no violations when the value is undefined', () => {
    const value = undefined;
    const context: ConstraintContext = {
      path: 'tags',
      root: {},
      value,
      constraint: 'unique',
      options: {},
      runNestedRules: () => [],
    };

    const violations = unique(value, context);

    expect(violations).toHaveLength(0);
  });
});
