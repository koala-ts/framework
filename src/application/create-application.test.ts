import { create } from '@/application/create-application';
import { koalaDefaultConfig } from '@/Config';
import request from 'supertest';
import { expect, test, vi } from 'vitest';

test('create app with default config', () => {
  const app = create(koalaDefaultConfig);

  expect(app).toBeDefined();
});

test('run configured global middleware', async () => {
  const middleware = vi.fn(async (_scope, next) => await next());
  const app = create({ ...koalaDefaultConfig, globalMiddleware: [middleware] });

  await request(app.callback()).get('/missing-route');

  expect(middleware).toHaveBeenCalledTimes(1);
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
