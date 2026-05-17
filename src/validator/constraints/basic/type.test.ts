import { describe, expect, it } from 'vitest';
import { type, TypeOptions } from './type';
import { ConstraintContext } from '@/validator/constraint-validator';
import {email} from "@/validator";

describe('type', () => {
  it.each([
    { expectedType: 'string', value: 42 },
    { expectedType: 'number', value: '42' },
    { expectedType: 'boolean', value: 'true' },
    { expectedType: 'bigint', value: 42 },
    { expectedType: 'symbol', value: 'symbol' },
    { expectedType: 'function', value: 'function' },
    { expectedType: 'object', value: ['Koala'] },
    { expectedType: 'array', value: { name: 'Koala' } },
    { expectedType: 'null', value: { name: 'Koala' } },
    { expectedType: 'undefined', value: 'Koala' },
  ])('returns a violation when the value does not match $expectedType', ({ expectedType, value }) => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'name',
      root: { name: value },
      value,
      constraint: 'type',
      options: { type: expectedType },
      runNestedRules: () => [],
    };

    const violations = type(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'name',
      constraint: 'type',
      message: `This value should be of type ${expectedType}.`,
      value,
    });
  });

  it.each([
    { expectedType: 'string', value: 'Koala' },
    { expectedType: 'number', value: 42 },
    { expectedType: 'boolean', value: true },
    { expectedType: 'bigint', value: 42n },
    { expectedType: 'symbol', value: Symbol('koala') },
    { expectedType: 'function', value: () => 'koala' },
    { expectedType: 'object', value: { name: 'Koala' } },
    { expectedType: 'array', value: ['Koala'] },
    { expectedType: 'null', value: null },
    { expectedType: 'undefined', value: undefined },
  ])('returns no violations when the value matches $expectedType', ({ expectedType, value }) => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'name',
      root: { name: value },
      value,
      constraint: 'type',
      options: { type: expectedType },
      runNestedRules: () => [],
    };

    const violations = type(value, context);

    expect(violations).toHaveLength(0);
  });

  it('returns no violations for undefined values', () => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'name',
      root: { name: undefined },
      value: undefined,
      constraint: 'type',
      options: { type: 'undefined' },
      runNestedRules: () => [],
    };

    const violations = type(undefined, context);

    expect(violations).toHaveLength(0);
  });

  it('returns no violations when the value matches one expected type', () => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'identifier',
      root: { identifier: 42 },
      value: 42,
      constraint: 'type',
      options: { type: ['string', 'number'] },
      runNestedRules: () => [],
    };

    const violations = type(42, context);

    expect(violations).toHaveLength(0);
  });

  it('returns a violation with all expected types when no expected type matches', () => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'identifier',
      root: { identifier: false },
      value: false,
      constraint: 'type',
      options: { type: ['string', 'number', 'object'] },
      runNestedRules: () => [],
    };

    const violations = type(false, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'identifier',
      constraint: 'type',
      message: 'This value should match at least one of these types [string, number, object].',
      value: false,
    });
  });

  it('returns no violations when the value is undefined', () => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'age',
      root: { age: undefined },
      value: undefined,
      constraint: 'type',
      options: { type: 'number' },
      runNestedRules: () => [],
    };

    const violations = type(undefined, context);

    expect(violations).toHaveLength(0);
  });

  it('uses a custom message when provided', () => {
    const context: ConstraintContext<TypeOptions> = {
      path: 'age',
      root: { age: '42' },
      value: '42',
      constraint: 'type',
      options: { type: 'number', message: 'Age must be numeric' },
      runNestedRules: () => [],
    };

    const violations = type('42', context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'age',
      constraint: 'type',
      message: 'Age must be numeric',
      value: '42',
    });
  });
});
