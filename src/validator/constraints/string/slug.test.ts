import { describe, expect, it } from 'vitest';
import { slug } from './slug';
import { ConstraintOptions } from '../../constraint';
import { ConstraintContext } from '../../constraint-validator';

describe('slug', () => {
  it('accepts valid slug with lowercase, digits and hyphens', () => {
    const context = createContext('article-123');

    const violations = slug('article-123', context);

    expect(violations).toHaveLength(0);
  });

  it.each([
    { value: 'Article-123', label: 'uppercase letters' },
    { value: 'my slug', label: 'spaces' },
    { value: 'my_slug', label: 'underscores' },
    { value: 'my@slug', label: 'special symbols' },
    { value: '-my-slug', label: 'leading hyphen' },
    { value: 'my-slug-', label: 'trailing hyphen' },
    { value: 'my--slug', label: 'consecutive hyphens' },
    { value: '', label: 'empty string' },
  ])('rejects invalid slug with $label', ({ value }) => {
    const context = createContext(value);

    const violations = slug(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'slug',
      constraint: 'slug',
      message: 'This value is not a valid slug.',
      value,
    });
  });

  it('rejects non-string values with default message', () => {
    const context = createContext(42);

    const violations = slug(42, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'slug',
      constraint: 'slug',
      message: 'This value is not a valid slug.',
      value: 42,
    });
  });

  it('returns no violations for undefined values', () => {
    const context = createContext(undefined);

    const violations = slug(undefined, context);

    expect(violations).toHaveLength(0);
  });

  it('uses a custom message when provided', () => {
    const context = createContext('invalid slug', { message: 'Slug is invalid' });

    const violations = slug('invalid slug', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'slug',
      constraint: 'slug',
      message: 'Slug is invalid',
      value: 'invalid slug',
    });
  });

  it('normalizes values before validation', () => {
    const context = createContext(' article-slug ', {
      normalizer: (value: string) => value.trim(),
    });

    const violations = slug(' article-slug ', context);

    expect(violations).toHaveLength(0);
  });
});

function createContext(value: unknown, options: ConstraintOptions = {}): ConstraintContext {
  return {
    path: 'slug',
    root: { slug: value },
    value,
    constraint: 'slug',
    options,
    runNestedRules: () => [],
  };
}
