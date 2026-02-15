import { flattenViolations } from '@/validator/flatten-violations';
import { Violation } from '@/validator/types';
import { describe, expect, test } from 'vitest';

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
});
