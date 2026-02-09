import { notBlank } from '@/validator/constraints/basic/not-blank';
import { email } from '@/validator/constraints/string/email';

export const builtInConstraints = {
  // Basic
  notBlank,

  // String
  email,
};
