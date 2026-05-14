import { describe, expect, it } from 'vitest';
import { notBlank } from './not-blank';
import { ConstraintContext } from '@/validator/constraint-validator';

describe('notBlank', () => {
  it.each([
    { value: '', label: 'empty string' },
    { value: null, label: 'null' },
    { value: undefined, label: 'undefined' },
    { value: [], label: 'empty array' },
  ])('returns a violation when value is $label and no options are provided', ({ value }) => {
    const context: ConstraintContext = {
      path: 'name',
      root: { name: value },
      value,
      constraint: 'notBlank',
      options: {},
      runNestedRules: () => [],
    };

    const violations = notBlank(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'name',
      constraint: 'notBlank',
      message: 'This value should not be blank.',
      value,
    });
  });

  it('uses a custom message when provided', () => {
    const context: ConstraintContext = {
      path: 'name',
      root: { name: '' },
      value: '',
      constraint: 'notBlank',
      options: { message: 'Required' },
      runNestedRules: () => [],
    };

    const violations = notBlank('', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'name',
      constraint: 'notBlank',
      message: 'Required',
      value: '',
    });
  });

  it('normalizes string values before checking blankness', () => {
    const context: ConstraintContext = {
      path: 'name',
      root: { name: '   ' },
      value: '   ',
      constraint: 'notBlank',
      options: { normalizer: (value: string) => value.trim() },
      runNestedRules: () => [],
    };

    const violations = notBlank('   ', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'name',
      constraint: 'notBlank',
      message: 'This value should not be blank.',
      value: '   ',
    });
  });

  it.each([
    { value: 'valid', label: 'non-empty string' },
    { value: ['value'], label: 'non-empty array' },
  ])('returns no violations for $label', ({ value }) => {
    const context: ConstraintContext = {
      path: 'name',
      root: { name: value },
      value,
      constraint: 'notBlank',
      options: {},
      runNestedRules: () => [],
    };

    const violations = notBlank(value, context);

    expect(violations).toHaveLength(0);
  });
});
