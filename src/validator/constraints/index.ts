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
export { type TypeOptions, type } from './basic/type';
// ## Basic ##

// ## Comparison ##
export { type UniqueOptions, unique } from './comparison/unique';
// ## Comparison ##

// ## String ##
export { email } from './string/email';
export { slug } from './string/slug';
// ## String ##

// ## Other ##
export { type AllOptions, all } from './other/all';
export { compound } from './other/compound';
// ## Other ##
