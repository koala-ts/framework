import { type HttpMiddleware } from '@/Http';
import { type ValidationRules, type Validator, type ViolationMapper } from '@/validator/types';
import { flattenViolations } from '@/validator/flatten-violations';

export function createValidationMiddleware(
  validate: Validator,
  mapViolations: ViolationMapper = flattenViolations,
): (validationRules: ValidationRules) => HttpMiddleware {
  return function createMiddleware(constraints: ValidationRules): HttpMiddleware {
    return async function middleware(scope, next): Promise<void> {
      const violations = validate(scope.request.body ?? {}, constraints);

      if (violations.length > 0) {
        scope.response.status = 400;
        scope.response.body = { errors: mapViolations(violations) };
        return;
      }

      await next();
    };
  };
}
