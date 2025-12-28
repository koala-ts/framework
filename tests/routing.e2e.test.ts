import { describe, expect, test, vi } from 'vitest';
import { createTestAgent, type KoalaConfig } from '../src';

describe('Routing E2E Test', () => {
  test('register global middleware', async () => {
    const middleware = vi.fn();
    const config = {
      globalMiddleware: [middleware],
    };
    const agent = createTestAgent(config as unknown as KoalaConfig);

    await agent.get('/some-route');

    expect(middleware).toHaveBeenCalled();
  });
});
