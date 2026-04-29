import { type HttpMiddleware, HttpScope, NextMiddleware } from '@/Http';
import { type ValidationRules, type Validator, Violation } from '@/validator/types';
import { flattenViolations } from '@/validator/flatten-violations';

export type ViolationMapper = (violations: Violation[]) => Record<string, string[]>;

export function createValidationMiddleware(
  validate: Validator,
  mapViolations: ViolationMapper = flattenViolations,
): (validationRules: ValidationRules) => HttpMiddleware {
  return function (validationRules: ValidationRules): HttpMiddleware {
    return async function middleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
      const violations = validate(scope.request.body ?? {}, validationRules);

      if (violations.length > 0) {
        scope.response.status = 400;
        scope.response.body = { errors: mapViolations(violations) };
        return;
      }

      await next();
    };
  };
}
