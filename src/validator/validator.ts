import type { Payload } from '#koala/validator/payload';
import type { ValidationSchema } from '#koala/validator/schema';
import type { Violation } from '#koala/validator/violation';

type Options = { groups?: string[] };

export type Validator = (payload: Payload, schema: ValidationSchema, options?: Options) => Violation[];
