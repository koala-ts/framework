import { type HttpBridge, type HttpListenOptions, httpLifecycleSuccess } from '@koala-ts/contracts/http-bridge';

/**
 * The Fastify runtime capabilities required by the bridge.
 */
type FastifyRuntime = Readonly<{
  readonly listen: (options: HttpListenOptions) => Promise<unknown>;
  readonly close: () => Promise<void>;
}>;

/**
 * Creates a fresh Fastify runtime for each bridge start cycle.
 */
type FastifyRuntimeFactory = () => FastifyRuntime;

/**
 * Creates an HTTP bridge from a Fastify runtime factory.
 */
type CreateFastifyBridge = (createRuntime: FastifyRuntimeFactory) => HttpBridge;

export const createFastifyBridge: CreateFastifyBridge = createRuntime => {
  let runtime: FastifyRuntime | undefined;

  return {
    start: async listen => {
      runtime = createRuntime();
      await runtime.listen(listen);

      return httpLifecycleSuccess(undefined);
    },
    stop: async () => {
      await runtime?.close();

      return httpLifecycleSuccess(undefined);
    },
  };
};
