import { describe, expect, it } from 'vitest';
import { createValidator } from '@/validator/factory/create-validator';
import { notBlank } from '@/validator/constraints/basic/not-blank';
import { email } from '@/validator/constraints/string/email';
import { compound } from './compound';

describe('compound (integration)', () => {
  it('applies nested constraints to the same value', () => {
    const requiredEmail = compound(['notBlank', 'email']);

    const validate = createValidator({
      constraints: {
        requiredEmail,
        notBlank,
        email,
      },
    });

    const rules = {
      userEmail: ['requiredEmail'],
    };

    const violations = validate({ userEmail: '' }, rules);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({
      path: 'userEmail',
      constraint: 'notBlank',
      message: 'This value should not be blank.',
      value: '',
    });
    expect(violations[1]).toEqual({
      path: 'userEmail',
      constraint: 'email',
      message: 'This value is not a valid email address.',
      value: '',
    });
  });

  it('accepts object rule definitions with options', () => {
    const requiredEmail = compound(['notBlank', { email: { message: 'Invalid email' } }]);

    const validate = createValidator({
      constraints: {
        requiredEmail,
        notBlank,
        email,
      },
    });

    const rules = {
      userEmail: ['requiredEmail'],
    };

    const violations = validate({ userEmail: '' }, rules);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({
      path: 'userEmail',
      constraint: 'notBlank',
      message: 'This value should not be blank.',
      value: '',
    });
    expect(violations[1]).toEqual({
      path: 'userEmail',
      constraint: 'email',
      message: 'Invalid email',
      value: '',
    });
  });

  it('uses the nested value passed via applyConstraints', () => {
    const requiredEmail = compound([{ email: { normalizer: (value: string) => value.trim() } }]);

    const validate = createValidator({
      constraints: {
        requiredEmail,
        email,
      },
    });

    const rules = {
      userEmail: ['requiredEmail'],
    };

    const violations = validate({ userEmail: ' user@example.com ' }, rules);

    expect(violations).toHaveLength(0);
  });
});
