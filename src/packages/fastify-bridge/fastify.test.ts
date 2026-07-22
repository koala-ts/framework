import { describe, expect, it, vi } from 'vitest';
import { createFastifyBridge } from '#fastify-bridge/fastify';

describe('Fastify bridge', () => {
  describe('bridge start', () => {
    it('starts the runtime using the requested listen options', async () => {
      const listen = { port: 3000, host: '127.0.0.1' } as const;
      const runtime = {
        listen: vi.fn(),
        close: vi.fn(),
      };
      const bridge = createFastifyBridge(() => runtime);

      const actual = await bridge.start(listen);

      expect(runtime.listen).toHaveBeenCalledWith(listen);
      expect(actual).toEqual({ _tag: 'Success', value: undefined });
    });
  });

  describe('bridge stop', () => {
    it('stops a started runtime', async () => {
      const runtime = {
        listen: vi.fn(),
        close: vi.fn(),
      };
      const bridge = createFastifyBridge(() => runtime);
      await bridge.start({ port: 3000 });

      const actual = await bridge.stop();

      expect(runtime.close).toHaveBeenCalledOnce();
      expect(actual).toEqual({ _tag: 'Success', value: undefined });
    });

    it('completes before the runtime starts', async () => {
      const runtime = {
        listen: vi.fn(),
        close: vi.fn(),
      };
      const bridge = createFastifyBridge(() => runtime);

      const actual = await bridge.stop();

      expect(runtime.close).not.toHaveBeenCalled();
      expect(actual).toEqual({ _tag: 'Success', value: undefined });
    });
  });
});
