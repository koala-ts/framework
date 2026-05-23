import { notBlank } from '@/validator/constraints/basic/not-blank';
import { type } from '@/validator/constraints/basic/type';
import { unique } from '@/validator/constraints/comparison/unique';
import { all } from '@/validator/constraints/other/all';
import { email } from '@/validator/constraints/string/email';
import { slug } from '@/validator/constraints/string/slug';

export const builtInConstraints = {
  // Basic
  notBlank,
  type,

  // Comparison
  unique,

  // Other
  all,

  // String
  email,
  slug,
};

// ## Basic ##
export { notBlank } from './basic/not-blank';
export { type, type TypeOptions } from './basic/type';
// ## Basic ##

// ## Comparison ##
export { unique, type UniqueOptions } from './comparison/unique';
// ## Comparison ##

// ## String ##
export { email } from './string/email';
export { slug } from './string/slug';
// ## String

// ## Other ##
export { all, type AllOptions } from './other/all';
export { compound } from './other/compound';
// ## Other ##
