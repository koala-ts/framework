import type { HttpMiddleware, HttpScope, NextMiddleware } from '#koala/Http/index';
import { flattenViolations } from '#koala/validator/flatten-violations';
import type { ValidationSchema } from '#koala/validator/schema';
import type { Validator } from '#koala/validator/validator';
import type { Violation } from '#koala/validator/violation';

type ViolationMapper = (violations: Violation[]) => Record<string, string[]>;

type ValidationMiddlewareOptions = {
  validate: Validator;
  mapViolations?: ViolationMapper;
};

export function createValidationMiddleware({
  validate,
  mapViolations = flattenViolations,
}: ValidationMiddlewareOptions): (validationSchema: ValidationSchema) => HttpMiddleware {
  return (validationSchema: ValidationSchema): HttpMiddleware =>
    async function middleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
      const violations = validate(scope.request.body ?? {}, validationSchema);

      if (violations.length > 0) {
        scope.response.status = 400;
        scope.response.body = { errors: mapViolations(violations) };
        return;
      }

      await next();
    };
}
