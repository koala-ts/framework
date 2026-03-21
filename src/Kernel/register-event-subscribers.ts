import { type Application } from '@/application/application';
import { type EventSubscriber } from '@/Kernel/types';

export function registerEventSubscribers(
  app: Application,
  map: Record<string, EventSubscriber | EventSubscriber[]> | undefined,
): Application {
  if (undefined === map) {
    return app;
  }

  for (const [event, subscriber] of normalizeEventSubscribers(map)) {
    app.on(event, subscriber as unknown as (...args: unknown[]) => void);
  }

  return app;
}

function normalizeEventSubscribers(
  map: Record<string, EventSubscriber | EventSubscriber[]>,
): Array<[string, EventSubscriber]> {
  const subscriptions: Array<[string, EventSubscriber]> = [];

  for (const [event, subscribers] of Object.entries(map)) {
    if (Array.isArray(subscribers)) {
      for (const subscriber of subscribers) {
        subscriptions.push([event, subscriber]);
      }

      continue;
    }

    subscriptions.push([event, subscribers]);
  }

  return subscriptions;
}
