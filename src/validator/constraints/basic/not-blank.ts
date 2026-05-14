import { ConstraintOptions } from '@/validator';
import { ConstraintValidator } from '@/validator';

const DEFAULT_MESSAGE = 'This value should not be blank.';

type NotBlankOptions = ConstraintOptions & {
  message?: string;
  normalizer?: (value: string) => string;
};

export const notBlank: ConstraintValidator<NotBlankOptions> = (value, context) => {
  const options = context.options;
  const message = options.message ?? DEFAULT_MESSAGE;

  const normalizedValue =
    typeof value === 'string' && typeof options.normalizer === 'function' ? options.normalizer(value) : value;

  if (isBlank(normalizedValue)) {
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
};

function isBlank(value: unknown): boolean {
  return value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0);
}
