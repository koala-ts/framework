import { describe, expect, test } from 'vitest';
import { notBlank } from '#koala/validator/constraints/basic/not-blank';
import { all } from '#koala/validator/constraints/other/all';
import { email } from '#koala/validator/constraints/string/email';
import { slug } from '#koala/validator/constraints/string/slug';
import { createValidator } from '#koala/validator/factory/create-validator';

describe('all (integration)', () => {
  describe('schema integration', () => {
    test('validation passes when the value is undefined', () => {
      const validate = createValidator({ constraints: { all, notBlank } });
      const rules = { tags: [{ all: { constraints: ['notBlank'] } }] };

      const violations = validate({}, rules);

      expect(violations).toHaveLength(0);
    });

    test('validation fails when the value is null', () => {
      const validate = createValidator({ constraints: { all, notBlank } });
      const rules = { tags: [{ all: { constraints: ['notBlank'] } }] };

      const violations = validate({ tags: null }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'all',
        message: 'This value must be a list.',
        value: null,
      });
    });

    test('validation fails when the value is not an array', () => {
      const validate = createValidator({ constraints: { all, notBlank } });
      const rules = { tags: [{ all: { constraints: ['notBlank'] } }] };

      const violations = validate({ tags: 'admin' }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'tags',
        constraint: 'all',
        message: 'This value must be a list.',
        value: 'admin',
      });
    });

    test('validation passes when all array elements satisfy nested constraints', () => {
      const validate = createValidator({ constraints: { all, notBlank } });
      const rules = { tags: [{ all: { constraints: ['notBlank'] } }] };

      const violations = validate({ tags: ['admin', 'editor'] }, rules);

      expect(violations).toHaveLength(0);
    });

    test('validation returns aggregated nested violations with indexed paths', () => {
      const validate = createValidator({ constraints: { all, notBlank, email } });
      const rules = { emails: [{ all: { constraints: ['notBlank', 'email'] } }] };

      const violations = validate({ emails: ['', 'invalid'] }, rules);

      expect(violations).toHaveLength(3);
      expect(violations[0]).toEqual({
        path: 'emails[0]',
        constraint: 'notBlank',
        message: 'This value should not be blank.',
        value: '',
      });
      expect(violations[1]).toEqual({
        path: 'emails[0]',
        constraint: 'email',
        message: 'This value is not a valid email address.',
        value: '',
      });
      expect(violations[2]).toEqual({
        path: 'emails[1]',
        constraint: 'email',
        message: 'This value is not a valid email address.',
        value: 'invalid',
      });
    });

    test('validation accepts nested object rule definitions with options', () => {
      const validate = createValidator({ constraints: { all, slug } });
      const rules = { slugs: [{ all: { constraints: [{ slug: { message: 'Invalid slug' } }] } }] };

      const violations = validate({ slugs: ['valid-slug', 'Invalid Slug'] }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'slugs[1]',
        constraint: 'slug',
        message: 'Invalid slug',
        value: 'Invalid Slug',
      });
    });

    test('validation preserves null array elements for nested constraints', () => {
      const validate = createValidator({ constraints: { all, email } });
      const rules = { emails: [{ all: { constraints: ['email'] } }] };

      const violations = validate({ emails: [null] }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'emails[0]',
        constraint: 'email',
        message: 'This value is not a valid email address.',
        value: null,
      });
    });

    test('validation appends indexed paths to bracketed field paths', () => {
      const validate = createValidator({ constraints: { all, email } });
      const rules = { 'user[emails]': [{ all: { constraints: ['email'] } }] };

      const violations = validate({ 'user[emails]': ['invalid'] }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'user[emails][0]',
        constraint: 'email',
        message: 'This value is not a valid email address.',
        value: 'invalid',
      });
    });
  });

  describe('groups', () => {
    test('validation skips all when groups do not intersect', () => {
      const validate = createValidator({ constraints: { all, notBlank } });
      const rules = { tags: [{ all: { constraints: ['notBlank'], groups: ['create'] } }] };

      const violations = validate({ tags: [''] }, rules, { groups: ['update'] });

      expect(violations).toHaveLength(0);
    });

    test('validation applies nested constraint groups to array elements', () => {
      const validate = createValidator({ constraints: { all, notBlank } });
      const rules = { tags: [{ all: { constraints: [{ notBlank: { groups: ['create'] } }] } }] };

      const violations = validate({ tags: [''] }, rules, { groups: ['update'] });

      expect(violations).toHaveLength(0);
    });
  });

  describe('composition', () => {
    test('validation composes another all constraint with indexed paths', () => {
      const validate = createValidator({ constraints: { all, email } });
      const rules = { matrix: [{ all: { constraints: [{ all: { constraints: ['email'] } }] } }] };

      const violations = validate({ matrix: [['valid@example.com'], ['invalid']] }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'matrix[1][0]',
        constraint: 'email',
        message: 'This value is not a valid email address.',
        value: 'invalid',
      });
    });
  });
});
