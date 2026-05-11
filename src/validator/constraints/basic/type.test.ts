import { describe, expect, it } from 'vitest';
import type { ConstraintContext } from '../../types';
import { type as typeConstraint } from './type';

describe('type', () => {
  it.each([
    { expectedType: 'string', value: 42 },
    { expectedType: 'number', value: '42' },
    { expectedType: 'boolean', value: 'true' },
    { expectedType: 'bigint', value: 42 },
    { expectedType: 'symbol', value: 'symbol' },
    { expectedType: 'function', value: 'function' },
    { expectedType: 'object', value: ['Koala'] },
    { expectedType: 'array', value: { name: 'Koala' } },
    { expectedType: 'null', value: { name: 'Koala' } },
    { expectedType: 'undefined', value: 'Koala' },
  ])('returns a violation when the value does not match $expectedType', ({ expectedType, value }) => {
    const context: ConstraintContext = {
      path: 'name',
      root: { name: value },
      value,
      constraint: 'type',
      options: { type: expectedType },
      runNestedRules: () => [],
    };

    const violations = typeConstraint(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'name',
      constraint: 'type',
      message: `This value should be of type ${expectedType}.`,
      value,
    });
  });
});
