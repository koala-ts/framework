import { expect, test, vi } from 'vitest';
import type { Application } from '@/application/application';
import { registerEventSubscribers } from '@/Kernel';

test('register a single event subscriber', () => {
  const on = vi.fn();
  const app = { on } as unknown as Application;
  const subscriber = vi.fn();

  registerEventSubscribers(app, { requestCompleted: subscriber });

  expect(on).toHaveBeenCalledWith('requestCompleted', subscriber);
});

test('register multiple event subscribers', () => {
  const on = vi.fn();
  const app = { on } as unknown as Application;
  const firstSubscriber = vi.fn();
  const secondSubscriber = vi.fn();

  registerEventSubscribers(app, { requestCompleted: [firstSubscriber, secondSubscriber] });

  expect(on).toHaveBeenNthCalledWith(1, 'requestCompleted', firstSubscriber);
  expect(on).toHaveBeenNthCalledWith(2, 'requestCompleted', secondSubscriber);
});
