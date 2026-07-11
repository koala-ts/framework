import { describe, expect, test } from 'vitest';
import { flattenViolations } from '@/validator/flatten-violations';
import type { Violation } from '@/validator/violation';

describe('Flatten violations', () => {
  test('it should flatten violations into JSON API format', () => {
    const violations: Violation[] = [
      {
        path: 'username',
        message: 'The username is required.',
        constraint: 'notBlank',
        value: undefined,
      },
      {
        path: 'username',
        message: 'The username must be unique.',
        constraint: 'uniqueUsername',
        value: 'existing_user',
      },
    ];

    const actual = flattenViolations(violations);

    expect(actual).toEqual({
      username: ['The username is required.', 'The username must be unique.'],
    });
  });

  test('it should format indexed violation paths', () => {
    const violations: Violation[] = [
      {
        path: 'emails[0]',
        message: 'This value is not a valid email address.',
        constraint: 'email',
        value: 'invalid',
      },
    ];

    const actual = flattenViolations(violations);

    expect(actual).toEqual({
      'emails.0': ['This value is not a valid email address.'],
    });
  });

  test('it should group multiple violations for the same formatted indexed path', () => {
    const violations: Violation[] = [
      {
        path: 'emails[0]',
        message: 'This value should not be blank.',
        constraint: 'notBlank',
        value: '',
      },
      {
        path: 'emails[0]',
        message: 'This value is not a valid email address.',
        constraint: 'email',
        value: '',
      },
    ];

    const actual = flattenViolations(violations);

    expect(actual).toEqual({
      'emails.0': ['This value should not be blank.', 'This value is not a valid email address.'],
    });
  });

  test('it should format deeply indexed violation paths', () => {
    const violations: Violation[] = [
      {
        path: 'matrix[1][0]',
        message: 'This value is not a valid email address.',
        constraint: 'email',
        value: 'invalid',
      },
    ];

    const actual = flattenViolations(violations);

    expect(actual).toEqual({
      'matrix.1.0': ['This value is not a valid email address.'],
    });
  });

  test('it should format named bracket paths', () => {
    const violations: Violation[] = [
      {
        path: 'user[emails][0]',
        message: 'This value is not a valid email address.',
        constraint: 'email',
        value: 'invalid',
      },
    ];

    const actual = flattenViolations(violations);

    expect(actual).toEqual({
      'user.emails.0': ['This value is not a valid email address.'],
    });
  });
});
