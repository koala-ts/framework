import { type HttpScope } from '@/Http';
import { builtInConstraints } from '@/validator/constraints';
import { flattenViolations } from '@/validator/flatten-violations';
import { createValidator } from '@/validator/validator';
import { describe, expect, test, vi } from 'vitest';
import { validationMiddleware } from './validation-middleware';

describe('Validation middleware', () => {
  test('returns flattened validation errors when request body is invalid', async () => {
    const validate = createValidator({ constraints: builtInConstraints });
    const createMiddleware = validationMiddleware(validate, flattenViolations);
    const middleware = createMiddleware({ username: ['notBlank'] });
    const scope = { request: { body: { username: '' } }, response: {} } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(scope.response.status).toBe(400);
    expect(scope.response.body).toEqual({ errors: { username: ['This value should not be blank.'] } });
    expect(next).not.toHaveBeenCalled();
  });

  test('continues to the next middleware when request body is valid', async () => {
    const validate = createValidator({ constraints: builtInConstraints });
    const createMiddleware = validationMiddleware(validate, flattenViolations);
    const middleware = createMiddleware({ username: ['notBlank'] });
    const scope = { request: { body: { username: 'koala' } }, response: {} } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(scope.response.status).toBeUndefined();
    expect(scope.response.body).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('validates an empty payload when the request body is missing', async () => {
    const validate = createValidator({ constraints: builtInConstraints });
    const createMiddleware = validationMiddleware(validate, flattenViolations);
    const middleware = createMiddleware({ username: ['notBlank'] });
    const scope = { request: {}, response: {} } as unknown as HttpScope;
    const next = vi.fn();

    await middleware(scope, next);

    expect(scope.response.status).toBe(400);
    expect(scope.response.body).toEqual({ errors: { username: ['This value should not be blank.'] } });
    expect(next).not.toHaveBeenCalled();
  });
});
