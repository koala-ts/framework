import type { HttpBridge } from '@koala-ts/contracts/http-bridge';
import { describe, expect, it } from 'vitest';
import { koala } from '#framework-bundle/koala';

describe('koala', () => {
  it('creates a koala application', () => {
    const manifest = {
      type: 'http',
      listen: { port: 3000 },
    } as const;
    const bridge: HttpBridge = {
      start: async () => ({ _tag: 'Success', value: undefined }),
      stop: async () => ({ _tag: 'Success', value: undefined }),
    };

    const app = koala(manifest, bridge);

    expect(app).toEqual({ manifest, bridge });
  });
});
