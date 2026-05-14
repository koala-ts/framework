import { type HttpMiddleware, HttpScope, NextMiddleware } from '@/Http';
import { flattenViolations } from '@/validator/flatten-violations';
import { ValidationSchema } from '@/validator/schema';
import { Violation } from '@/validator/violation';
import { Validator } from '@/validator/validator';

type ViolationMapper = (violations: Violation[]) => Record<string, string[]>;

type ValidationMiddlewareOptions = {
  validate: Validator;
  mapViolations?: ViolationMapper;
};

export function createValidationMiddleware({
  validate,
  mapViolations = flattenViolations,
}: ValidationMiddlewareOptions): (validationSchema: ValidationSchema) => HttpMiddleware {
  return function (validationSchema: ValidationSchema): HttpMiddleware {
    return async function middleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
      const violations = validate(scope.request.body ?? {}, validationSchema);

      if (violations.length > 0) {
        scope.response.status = 400;
        scope.response.body = { errors: mapViolations(violations) };
        return;
      }

      await next();
    };
  };
}
