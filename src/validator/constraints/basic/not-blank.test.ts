import { describe, expect, it } from 'vitest';
import { notBlank } from './not-blank';
import type { ConstraintContext } from '../../types';

describe('notBlank (unit)', () => {
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
});
