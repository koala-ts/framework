import { describe, expect, it } from 'vitest';
import { UnknownConstraintError } from './errors';
import type { ConstraintContext, Violation } from './types';
import { createValidator } from './validator';

describe('Validator', () => {
  describe('Registry', () => {
    it('should fail when a rule references an undefined constraint', () => {
      const validate = createValidator({ constraints: {} });

      const rules = {
        name: {
          required: {},
        },
      };

      expect(() => validate({ name: 'John' }, rules)).toThrowError(UnknownConstraintError);
      expect(() => validate({ name: 'John' }, rules)).toThrowError(
        'Field "name" references unregistered constraint "required"',
      );
    });
  });

  describe('Violations', () => {
    it('should use provided constraints registry to validate rules', () => {
      const validate = createValidator({
        constraints: {
          customConstraint,
        },
      });

      const rules = {
        name: {
          customConstraint: {},
        },
      };

      const violations = validate({ name: '' }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'name',
        constraint: 'customConstraint',
        message: 'Custom constraint validation failed',
        value: '',
      });
    });

    it('should map each violation to the invalid field', () => {
      const validate = createValidator({
        constraints: {
          customConstraint,
        },
      });
      const rules = {
        name: {
          customConstraint: {},
        },
        age: {
          customConstraint: {},
        },
      };

      const violations = validate({ name: '', age: 30 }, rules);

      expect(violations).toHaveLength(2);
      expect(violations[0]).toEqual({
        path: 'name',
        constraint: 'customConstraint',
        message: 'Custom constraint validation failed',
        value: '',
      });
      expect(violations[1]).toEqual({
        path: 'age',
        constraint: 'customConstraint',
        message: 'Custom constraint validation failed',
        value: 30,
      });
    });

    it('should not append empty violations', () => {
      const validate = createValidator({
        constraints: {
          passedConstraint,
        },
      });

      const rules = {
        name: {
          passedConstraint: {},
        },
      };

      const violations = validate({ name: 'John' }, rules);

      expect(violations).toHaveLength(0);
    });

    it('should validate field with multiple constraints', () => {
      const validate = createValidator({
        constraints: {
          customConstraint,
          anotherCustomConstraint,
        },
      });

      const rules = {
        name: {
          customConstraint: {},
          anotherCustomConstraint: {},
        },
      };

      const violations = validate({ name: '' }, rules);

      expect(violations).toHaveLength(2);
      expect(violations[0]).toEqual({
        path: 'name',
        constraint: 'customConstraint',
        message: 'Custom constraint validation failed',
        value: '',
      });
      expect(violations[1]).toEqual({
        path: 'name',
        constraint: 'anotherCustomConstraint',
        message: 'Another custom constraint validation failed',
        value: '',
      });
    });
  });

  describe('Constraint options', () => {
    it('should pass rule options to constraints', () => {
      const validate = createValidator({
        constraints: {
          minLengthConstraint,
        },
      });

      const rules = {
        name: {
          minLengthConstraint: { min: 3 },
        },
      };

      const violations = validate({ name: 'ab' }, rules);

      expect(violations).toHaveLength(1);
      expect(violations[0]).toEqual({
        path: 'name',
        constraint: 'minLengthConstraint',
        message: 'Must be at least 3 characters',
        value: 'ab',
      });
    });
  });
});

function customConstraint(value: unknown, context: ConstraintContext): Violation[] {
  return [
    {
      path: context.path,
      message: 'Custom constraint validation failed',
      constraint: context.constraint,
      value,
    },
  ];
}

function anotherCustomConstraint(value: unknown, context: ConstraintContext): Violation[] {
  return [
    {
      path: context.path,
      message: 'Another custom constraint validation failed',
      constraint: context.constraint,
      value,
    },
  ];
}

function passedConstraint(_: unknown, __: ConstraintContext): Violation[] {
  return [];
}

function minLengthConstraint(value: unknown, context: ConstraintContext): Violation[] {
  const min = context.options.min;

  if (typeof value === 'string' && typeof min === 'number' && value.length < min) {
    return [
      {
        path: context.path,
        message: `Must be at least ${min} characters`,
        constraint: context.constraint,
        value,
      },
    ];
  }

  return [];
}
