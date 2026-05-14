import { notBlank } from '@/validator/constraints/basic/not-blank';
import { email } from '@/validator/constraints/string/email';
import { slug } from '@/validator/constraints/string/slug';

export const builtInConstraints = {
  // Basic
  notBlank,

  // String
  email,
  slug,
};

export * from './string/email';
export * from './string/slug';
export * from './basic/not-blank';
export * from './other/compound';
