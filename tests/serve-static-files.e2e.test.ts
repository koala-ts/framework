import { describe, expect, test } from 'vitest';
import { createTestAgent, type KoalaConfig } from '../src';

describe('Serve static files E2E Test', () => {
  test('serve text file', async () => {
    const agent = createTestAgent({
      staticFiles: { root: 'tests/fixtures' },
    } as unknown as KoalaConfig);

    const response = await agent.get('/sample.txt');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
    expect(response.text).toBe('Howdy!\n');
  });

  test('serve image file', async () => {
    const agent = createTestAgent({
      staticFiles: { root: 'tests/fixtures' },
    } as unknown as KoalaConfig);

    const response = await agent.get('/avatar.png');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('image/png');
    expect(response.body).toBeInstanceOf(Buffer);
  });
});
