import { Violation } from './violation';
import { Payload } from './payload';
import { ValidationSchema } from './schema';

type Options = { groups?: string[] };

export type Validator = (payload: Payload, schema: ValidationSchema, options?: Options) => Violation[];
