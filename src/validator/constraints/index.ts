import { notBlank } from '#koala/validator/constraints/basic/not-blank';
import { type } from '#koala/validator/constraints/basic/type';
import { unique } from '#koala/validator/constraints/comparison/unique';
import { all } from '#koala/validator/constraints/other/all';
import { email } from '#koala/validator/constraints/string/email';
import { slug } from '#koala/validator/constraints/string/slug';

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
export { notBlank } from '#koala/validator/constraints/basic/not-blank';
export { type TypeOptions, type } from '#koala/validator/constraints/basic/type';
// ## Basic ##

// ## Comparison ##
export { type UniqueOptions, unique } from '#koala/validator/constraints/comparison/unique';
// ## Comparison ##

// ## String ##
export { email } from '#koala/validator/constraints/string/email';
export { slug } from '#koala/validator/constraints/string/slug';
// ## String ##

// ## Other ##
export { type AllOptions, all } from '#koala/validator/constraints/other/all';
export { compound } from '#koala/validator/constraints/other/compound';
// ## Other ##
