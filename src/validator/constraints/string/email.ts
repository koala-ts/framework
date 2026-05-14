import type { ConstraintContext } from '../../types';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value is not a valid email address.';

type EmailOptions = {
  message?: string;
  normalizer?: (value: string) => string;
};

const strictEmailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

export function email(value: unknown, context: ConstraintContext): Violation[] {
  const options = context.options as EmailOptions;
  const message = options.message ?? DEFAULT_MESSAGE;

  if (value === undefined) {
    return [];
  }

  if (typeof value !== 'string') {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message,
        value,
      },
    ];
  }

  const normalized = options.normalizer ? options.normalizer(value) : value;

  if (!strictEmailRegex.test(normalized)) {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message,
        value,
      },
    ];
  }

  return [];
}
