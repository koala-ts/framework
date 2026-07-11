import type { Payload } from './payload';
import type { ValidationSchema } from './schema';
import type { Violation } from './violation';

type Options = { groups?: string[] };

export type Validator = (payload: Payload, schema: ValidationSchema, options?: Options) => Violation[];
