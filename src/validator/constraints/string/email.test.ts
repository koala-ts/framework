import { describe, expect, it } from 'vitest';
import { email } from './email';
import type { ConstraintContext } from '../../types';

describe('email', () => {
  it('rejects invalid email by default', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 'invalid' },
      value: 'invalid',
      constraint: 'email',
      options: {},
      applyConstraints: () => [],
    };

    const violations = email('invalid', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'email',
      constraint: 'email',
      message: 'This value is not a valid email address.',
      value: 'invalid',
    });
  });

  it('accepts valid email by default', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 'user@example.com' },
      value: 'user@example.com',
      constraint: 'email',
      options: {},
      applyConstraints: () => [],
    };

    const violations = email('user@example.com', context);

    expect(violations).toHaveLength(0);
  });

  it('rejects localhost domains by default', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 'user@localhost' },
      value: 'user@localhost',
      constraint: 'email',
      options: {},
      applyConstraints: () => [],
    };

    const violations = email('user@localhost', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'email',
      constraint: 'email',
      message: 'This value is not a valid email address.',
      value: 'user@localhost',
    });
  });

  it('normalizes values before validation', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: ' USER@EXAMPLE.COM ' },
      value: ' USER@EXAMPLE.COM ',
      constraint: 'email',
      options: { normalizer: (value: string) => value.trim().toLowerCase() },
      applyConstraints: () => [],
    };

    const violations = email(' USER@EXAMPLE.COM ', context);

    expect(violations).toHaveLength(0);
  });

  it('uses a custom message when provided', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 'invalid' },
      value: 'invalid',
      constraint: 'email',
      options: { message: 'Invalid email' },
      applyConstraints: () => [],
    };

    const violations = email('invalid', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'email',
      constraint: 'email',
      message: 'Invalid email',
      value: 'invalid',
    });
  });
});
