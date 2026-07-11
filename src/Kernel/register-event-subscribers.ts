import type { Application } from '#koala/application/application';
import type { EventSubscriber } from '#koala/Kernel/types';

export function registerEventSubscribers(
  app: Application,
  map: Record<string, EventSubscriber | EventSubscriber[]> | undefined,
): void {
  if (undefined === map) {
    return;
  }

  for (const [event, subscriber] of normalizeEventSubscribers(map)) {
    app.on(event, subscriber as unknown as (...args: unknown[]) => void);
  }
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
