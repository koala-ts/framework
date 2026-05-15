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
});
