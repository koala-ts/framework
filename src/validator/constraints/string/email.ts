import type { ConstraintContext, Violation } from '../../types';

const DEFAULT_MESSAGE = 'This value is not a valid email address.';

type EmailOptions = {
  message?: string;
  normalizer?: (value: string) => string;
};

const strictEmailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

export function email(value: unknown, context: ConstraintContext): Violation[] {
  if (typeof value !== 'string') {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message: DEFAULT_MESSAGE,
        value,
      },
    ];
  }

  const options = context.options as EmailOptions;
  const message = options.message ?? DEFAULT_MESSAGE;
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
