import { describe, expect, test, vi } from 'vitest';
import type { HttpMiddleware, HttpScope } from '#koala/Http/index';
import { flattenViolations } from '#koala/validator/flatten-violations';
import { createValidationMiddleware } from '#koala/validator/middleware/create-validation-middleware';
import type { Validator } from '#koala/validator/validator';
import type { Violation } from '#koala/validator/violation';

describe('createValidationMiddleware', () => {
  test('continues to the next middleware when validation passes', async () => {
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

  test('creates a 400 response when validation fails', async () => {
    const violations: Violation[] = [
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

  test('flattens violations by default', async () => {
    const violations: Violation[] = [
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

  test('uses the injected violation mapper for the error response', async () => {
    const violations: Violation[] = [
      {
        path: 'name',
        message: 'This value should not be blank.',
        constraint: 'notBlank',
        value: '',
      },
    ];
    const validate: Validator = vi.fn().mockReturnValue(violations);
    const mapViolations = vi.fn().mockReturnValue({ form: ['invalid request'] });
    const middleware: HttpMiddleware = createValidationMiddleware({ validate, mapViolations })({
      name: ['notBlank'],
    });
    const scope = {
      request: { body: { name: '' } },
      response: { status: 200 },
    } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(mapViolations).toHaveBeenCalledWith(violations);
    expect(scope.response.status).toBe(400);
    expect(scope.response.body).toEqual({ errors: { form: ['invalid request'] } });
    expect(next).not.toHaveBeenCalled();
  });
});
