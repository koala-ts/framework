import { HttpMiddleware, type HttpScope } from '@/Http';
import { flattenViolations } from '@/validator/flatten-violations';
import { describe, expect, test, vi } from 'vitest';
import { createValidationMiddleware } from './create-validation-middleware';
import { Validator } from '@/validator/types';

describe('Validation middleware', () => {
  test('continues to the next middleware when no constrains are violated', async () => {
    const validate: Validator = vi.fn().mockReturnValue([]);
    const middleware: HttpMiddleware = createValidationMiddleware({ validate, mapViolations: flattenViolations })({
      name: ['notBlank'],
    });
    const scope = {
      request: { body: { name: 'koala-example-name' } },
      response: { status: 200 },
    } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(scope.response.status).toBe(200);
    expect(scope.response.body).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('should create a response if constrains are violated', async () => {
    const violations = [
      {
        path: 'name',
        message: 'This value should not be blank.',
        constraint: 'notBlank',
        value: '',
      },
    ];
    const validate: Validator = vi.fn().mockReturnValue(violations);
    const middleware: HttpMiddleware = createValidationMiddleware({ validate, mapViolations: flattenViolations })({
      name: ['notBlank'],
    });
    const scope = {
      request: { body: { name: '' } },
      response: { status: 404, body: {} },
    } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(scope.response.status).toBe(400);
    expect(scope.response.body).toEqual({ errors: { name: ['This value should not be blank.'] } });
    expect(next).not.toHaveBeenCalled();
  });

  test('it flats the violation by default', async () => {
    const violations = [
      {
        path: 'name',
        message: 'This value should not be blank.',
        constraint: 'notBlank',
        value: '',
      },
    ];
    const validate: Validator = vi.fn().mockReturnValue(violations);
    const middleware: HttpMiddleware = createValidationMiddleware({ validate })({ name: ['notBlank'] });
    const scope = {
      request: { body: { name: '' } },
      response: { status: 404, body: {} },
    } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(scope.response.body).toEqual({ errors: { name: ['This value should not be blank.'] } });
  });
});
