import { describe, expect, test, vi } from 'vitest';
import { create, type KoalaConfig, koalaDefaultConfig } from '../src';

describe('Register Event Subscribers', () => {
  test('Register single subscriber for an event', () => {
    const config = {
      ...koalaDefaultConfig,
      eventSubscribers: {
        firstEvent: vi.fn(),
      },
    };
    const app = create(config as unknown as KoalaConfig);

    app.emit('firstEvent', 'data1');

    expect(config.eventSubscribers.firstEvent).toHaveBeenCalledWith('data1');
  });

  test('Register multiple subscribers for an event', () => {
    const firstSubscriber = vi.fn();
    const secondSubscriber = vi.fn();
    const config = {
      ...koalaDefaultConfig,
      eventSubscribers: {
        multiEvent: [firstSubscriber, secondSubscriber],
      },
    };
    const app = create(config as unknown as KoalaConfig);

    app.emit('multiEvent', 'data2');

    expect(firstSubscriber).toHaveBeenCalledWith('data2');
    expect(secondSubscriber).toHaveBeenCalledWith('data2');
  });

  test('Register async subscriber for an event', () => {
    const internalFn = vi.fn();
    const asyncSubscriber = async (data: string): Promise<void> => {
      await internalFn(data);
    };
    const config = {
      ...koalaDefaultConfig,
      eventSubscribers: {
        asyncEvent: asyncSubscriber,
      },
    };
    const app = create(config as unknown as KoalaConfig);

    app.emit('asyncEvent', 'data3');

    expect(internalFn).toHaveBeenCalledWith('data3');
  });
});
