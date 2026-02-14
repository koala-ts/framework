import { notBlank } from './basic/not-blank';
import { email } from './string/email';

export const builtInConstraints = {
  // Basic
  notBlank,

  // String
  email,
};

export * from './string/email';
export * from './basic/not-blank';
export * from './other/compound';
