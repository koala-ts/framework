import { describe, expect, it, vi } from 'vitest';
import type { ConstraintContext } from '#koala/validator/constraint-validator';
import { compound } from '#koala/validator/constraints/other/compound';
import type { Violation } from '#koala/validator/violation';

describe('compound', () => {
  it('creates a constraint that applies nested constraints from arrays', () => {
    const applyConstraints = vi.fn((): Violation[] => [
      {
        path: 'user',
        constraint: 'notBlank',
        message: 'Required',
        value: '',
      },
    ]);

    const nestedConstraints = ['notBlank'];

    const context: ConstraintContext = {
      path: 'user',
      root: { user: '' },
      value: '',
      constraint: 'requiredEmail',
      options: {},
      runNestedRules: applyConstraints,
    };

    const requiredEmail = compound(nestedConstraints);
    const violations = requiredEmail('', context);

    expect(applyConstraints).toHaveBeenCalledWith('', ['notBlank'], 'user');
    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'user',
      constraint: 'notBlank',
      message: 'Required',
      value: '',
    });
  });

  it('creates a constraint that applies nested constraints from objects', () => {
    const applyConstraints = vi.fn((): Violation[] => [
      {
        path: 'user',
        constraint: 'notNull',
        message: 'Required',
        value: null,
      },
    ]);

    const context: ConstraintContext = {
      path: 'user',
      root: { user: null },
      value: null,
      constraint: 'requiredEmail',
      options: {},
      runNestedRules: applyConstraints,
    };

    const requiredEmail = compound({ notNull: {} });
    const violations = requiredEmail(null, context);

    expect(applyConstraints).toHaveBeenCalledWith(null, { notNull: {} }, 'user');
    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'user',
      constraint: 'notNull',
      message: 'Required',
      value: null,
    });
  });
});
