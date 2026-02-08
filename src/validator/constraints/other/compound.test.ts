import { describe, expect, it, vi } from 'vitest';
import { compound } from './compound';
import type { ConstraintContext, Violation } from '../../types';

describe('compound', () => {
  it('applies nested constraints using applyConstraints', () => {
    const applyConstraints = vi.fn((): Violation[] => [
      {
        path: 'user',
        constraint: 'notBlank',
        message: 'Required',
        value: '',
      },
    ]);

    const nestedConstraints = {
      notBlank: {},
    };

    const context: ConstraintContext = {
      path: 'user',
      root: { user: '' },
      value: '',
      constraint: 'compound',
      options: { constraints: nestedConstraints },
      applyConstraints,
    };

    const violations = compound('', context);

    expect(applyConstraints).toHaveBeenCalledWith('', nestedConstraints, 'user');
    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'user',
      constraint: 'notBlank',
      message: 'Required',
      value: '',
    });
  });
});
