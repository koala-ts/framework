import { notBlank } from '@/validator/constraints/basic/not-blank';
import { unique } from '@/validator/constraints/comparison/unique';
import { email } from '@/validator/constraints/string/email';
import { slug } from '@/validator/constraints/string/slug';
import { type } from '@/validator/constraints/basic/type';

export const builtInConstraints = {
  // Basic
  notBlank,
  type,

  // Comparison
  unique,

  // String
  email,
  slug,
};

export * from './string/email';
export * from './string/slug';
export * from './basic/not-blank';
export { unique, type UniqueOptions } from './comparison/unique';
export * from './basic/type';
export { unique, type UniqueOptions } from './comparison/unique';
export * from './basic/type';
export * from './other/compound';
