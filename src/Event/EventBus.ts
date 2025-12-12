import { type EventBusStorage, type EventEmitter } from '@/Event/types';
import { createStore, type HttpRequest, type HttpResponse, type HttpScope, type NextMiddleware, type ScopeStore } from '@/Http';

const eventBusStorage = createStore<EventBusStorage>();

export async function eventBusMiddleware(
  scope: HttpScope,
  next: NextMiddleware,
  storage: ScopeStore<EventBusStorage> = eventBusStorage,
): Promise<void> {
  await storage.run({ eventEmitter: scope.app, scope }, next);
}

export function useEmit(storage: ScopeStore<EventBusStorage> = eventBusStorage): EventEmitter {
  return storage.get('eventEmitter');
}

export function useRequest(storage: ScopeStore<EventBusStorage> = eventBusStorage): HttpRequest {
  return storage.get('scope').request;
}

export function useResponse(storage: ScopeStore<EventBusStorage> = eventBusStorage): HttpResponse {
  return storage.get('scope').response;
}
