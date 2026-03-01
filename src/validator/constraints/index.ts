import { notBlank } from './basic/not-blank';
import { email } from './string/email';
import { slug } from './string/slug';

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
