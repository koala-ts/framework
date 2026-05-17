import { ConstraintContext } from '@/validator/constraint-validator';
import { describe, expect, it } from 'vitest';
import { type, TypeOptions } from './type';

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
  ] as const)('returns a violation when the value does not match $expectedType', ({ expectedType, value }) => {
    const context = createContext('name', value, { type: expectedType });

    const violations = type(value, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'name',
      constraint: 'type',
      message: `This value should match at least one of these types [${expectedType}].`,
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
  ] as const)('returns no violations when the value matches $expectedType', ({ expectedType, value }) => {
    const context = createContext('name', value, { type: expectedType });

    const violations = type(value, context);

    expect(violations).toHaveLength(0);
  });

  it('it should bypass undefined value', () => {
    const context = createContext('name', undefined, { type: 'number' });

    const violations = type(undefined, context);

    expect(violations).toHaveLength(0);
  });

  it('returns no violations when the value matches one expected type', () => {
    const context = createContext('identifier', 42, { type: ['string', 'number'] });

    const violations = type(42, context);

    expect(violations).toHaveLength(0);
  });

  it('returns a violation with all expected types when no expected type matches', () => {
    const context = createContext('identifier', false, { type: ['string', 'number', 'object'] });

    const violations = type(false, context);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      path: 'identifier',
      constraint: 'type',
      message: 'This value should match at least one of these types [string, number, object].',
      value: false,
    });
  });

  it('uses a custom message when provided', () => {
    const context = createContext('age', '42', { type: 'number', message: 'Age must be numeric' });

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

function createContext(path: string, value: unknown, options: TypeOptions): ConstraintContext<TypeOptions> {
  return {
    path,
    root: { [path]: value },
    value,
    constraint: 'type',
    options,
    runNestedRules: () => [],
  };
}
