import { describe, expect, it } from 'vitest';
import type { ConstraintContext, ConstraintOptions } from '../../types';
import { type as typeConstraint } from './type';

describe('type', () => {
  it('returns no violations when the value matches the expected type', () => {
    const context = createContext('Koala', { type: 'string' });

    const violations = typeConstraint('Koala', context);

    expect(violations).toHaveLength(0);
  });
});

function createContext(value: unknown, options: ConstraintOptions = {}): ConstraintContext {
  return {
    path: 'name',
    root: { name: value },
    value,
    constraint: 'type',
    options,
    runNestedRules: () => [],
  };
}
