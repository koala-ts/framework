import type { ConstraintContext } from '../../types';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value is not a valid slug.';

type SlugOptions = {
  message?: string;
  normalizer?: (value: string) => string;
};

const strictSlugRegex = /^(?!-)(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slug(value: unknown, context: ConstraintContext): Violation[] {
  const options = context.options as SlugOptions;
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

  if (!strictSlugRegex.test(normalized)) {
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
