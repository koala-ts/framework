import { describe, expect, test, vi } from 'vitest';
import { createTestAgent, KoalaConfig, Route } from '../src';
import { useEmit } from '../src/Kernel';

class MyController {
  @Route({ method: 'ANY', path: '/publish-event' })
  publishEvent(): void {
    const emitter = useEmit();
    emitter.emit('myEvent', { data: 'event-data' });
  }
}

describe('Event subscribers e2e Test', () => {
  test('subscribe to and event', async () => {
    const handler = vi.fn();
    const agent = createTestAgent({
      controllers: [MyController],
      eventSubscribers: { myEvent: handler },
    } as unknown as KoalaConfig);

    await agent.get('/publish-event');

    expect(handler).toHaveBeenCalledWith({ data: 'event-data' });
  });

  test('multiple subscribers to an event', async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const agent = createTestAgent({
      controllers: [MyController],
      eventSubscribers: { myEvent: [handler1, handler2] },
    } as unknown as KoalaConfig);

    await agent.get('/publish-event');

    expect(handler1).toHaveBeenCalledWith({ data: 'event-data' });
    expect(handler2).toHaveBeenCalledWith({ data: 'event-data' });
  });
});
