import type { HttpBridge } from '@koala-ts/contracts/http-bridge';
import { describe, expect, it } from 'vitest';
import { start, stop } from '#framework-bundle/http/lifecycle';
import { koala } from '#framework-bundle/koala';

describe('http lifecycle', () => {
  it('starts an app through its bridge', async () => {
    const manifest = { type: 'http', listen: { port: 3000 } } as const;
    let receivedListen: unknown;
    const bridge: HttpBridge = {
      start: async listen => {
        receivedListen = listen;
        return { _tag: 'Success', value: undefined };
      },
      stop: async () => ({ _tag: 'Success', value: undefined }),
    };
    const app = koala(manifest, bridge);

    const server = await start(app);

    expect(receivedListen).toBe(app.manifest.listen);
    expect(server).toEqual({
      _tag: 'Success',
      value: { app },
    });
  });

  it('returns a bridge failure when it cannot start an app', async () => {
    const manifest = { type: 'http', listen: { port: 3000 } } as const;
    const failure = {
      _tag: 'Failure',
      error: {
        code: 'START_FAILED',
        message: 'unavailable',
      },
    } as const;
    const bridge: HttpBridge = {
      start: async () => failure,
      stop: async () => ({ _tag: 'Success', value: undefined }),
    };
    const app = koala(manifest, bridge);

    const actual = await start(app);

    expect(actual).toBe(failure);
  });

  it('returns its app when stopped', async () => {
    const manifest = { type: 'http', listen: { port: 3000 } } as const;
    const bridgeStopCalls: boolean[] = [];
    const bridge: HttpBridge = {
      start: async () => ({ _tag: 'Success', value: undefined }),
      stop: async () => {
        bridgeStopCalls.push(true);
        return { _tag: 'Success', value: undefined };
      },
    };
    const app = koala(manifest, bridge);
    const server = { app };

    const actual = await stop(server);

    expect(bridgeStopCalls).toEqual([true]);
    expect(actual).toEqual({ _tag: 'Success', value: app });
  });

  it('returns a bridge failure when it cannot stop an app', async () => {
    const manifest = { type: 'http', listen: { port: 3000 } } as const;
    const failure = {
      _tag: 'Failure',
      error: {
        code: 'STOP_FAILED',
        message: 'unavailable',
      },
    } as const;
    const bridge: HttpBridge = {
      start: async () => ({ _tag: 'Success', value: undefined }),
      stop: async () => failure,
    };
    const app = koala(manifest, bridge);
    const server = { app };

    const actual = await stop(server);

    expect(actual).toBe(failure);
  });
});
