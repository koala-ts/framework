import type { HttpBridge } from '@koala-ts/contracts/http-bridge';
import createFastifyRuntime, { type FastifyServerOptions } from 'fastify';
import { createFastifyBridge } from '#fastify-bridge/fastify';

/**
 * Creates an HTTP bridge backed by Fastify.
 *
 * Fastify options remain local to this bridge; consumers interact with the
 * returned value through the framework bundle's runtime-neutral contract.
 */
type Fastify = (options?: FastifyServerOptions) => HttpBridge;

export const fastify: Fastify = options =>
  createFastifyBridge(() => (options === undefined ? createFastifyRuntime() : createFastifyRuntime(options)));
