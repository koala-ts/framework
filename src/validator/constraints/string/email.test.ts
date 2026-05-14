import { describe, expect, it } from 'vitest';
import { email } from './email';
import { ConstraintContext } from '@/validator/constraint';

describe('email', () => {
  it('rejects invalid email by default', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 'invalid' },
      value: 'invalid',
      constraint: 'email',
      options: {},
      runNestedRules: () => [],
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
      runNestedRules: () => [],
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
      runNestedRules: () => [],
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
      runNestedRules: () => [],
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
      runNestedRules: () => [],
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

  it('rejects non-string values with the default message', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 42 },
      value: 42,
      constraint: 'email',
      options: {},
      runNestedRules: () => [],
    };

    const violations = email(42, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'email',
      constraint: 'email',
      message: 'This value is not a valid email address.',
      value: 42,
    });
  });

  it('uses a custom message for non-string values', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: 42 },
      value: 42,
      constraint: 'email',
      options: { message: 'Invalid email' },
      runNestedRules: () => [],
    };

    const violations = email(42, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'email',
      constraint: 'email',
      message: 'Invalid email',
      value: 42,
    });
  });

  it('returns no violations for undefined values', () => {
    const context: ConstraintContext = {
      path: 'email',
      root: { email: undefined },
      value: undefined,
      constraint: 'email',
      options: {},
      runNestedRules: () => [],
    };

    const violations = email(undefined, context);

    expect(violations).toHaveLength(0);
  });
});
