import { expect, test, vi } from 'vitest';
import { create } from '@/Application/ApplicationFactory';
import { koalaDefaultConfig } from '@/Config';

test('create app with default config', () => {
  const app = create(koalaDefaultConfig);

  expect(app).toBeDefined();
});

test('register configured global middleware', () => {
  const middleware = vi.fn(async (_scope, next) => await next());
  const app = create({ ...koalaDefaultConfig, globalMiddleware: [middleware] });

  const registeredMiddleware = app.middleware.includes(middleware);

  expect(registeredMiddleware).toBe(true);
});

test('register a single event subscriber', () => {
  const subscriber = vi.fn();
  const app = create({ ...koalaDefaultConfig, eventSubscribers: { requestCompleted: subscriber } });

  app.emit('requestCompleted', 'payload');

  expect(subscriber).toHaveBeenCalledWith('payload');
});

test('register multiple event subscribers', () => {
  const firstSubscriber = vi.fn();
  const secondSubscriber = vi.fn();
  const app = create({
    ...koalaDefaultConfig,
    eventSubscribers: { requestCompleted: [firstSubscriber, secondSubscriber] },
  });

  app.emit('requestCompleted', 'payload');

  expect(firstSubscriber).toHaveBeenCalledWith('payload');
  expect(secondSubscriber).toHaveBeenCalledWith('payload');
});
