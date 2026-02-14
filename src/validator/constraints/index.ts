import { notBlank } from '@/validator/constraints/basic/not-blank';
import { email } from '@/validator/constraints/string/email';

export const builtInConstraints = {
  // Basic
  notBlank,

  // String
  email,
};

export * from './string/email';
export * from './basic/not-blank';
export * from './other/compound';
