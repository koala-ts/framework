import {
  createStore,
  type HttpRequest,
  type HttpResponse,
  type HttpScope,
  type NextMiddleware,
  type ScopeStore,
} from '#koala/Http/index';

export interface ScopeEventEmitter {
  emit(event: string, ...args: unknown[]): void;
}

export interface ScopeStorage {
  eventEmitter: ScopeEventEmitter;
  scope: HttpScope;
}

const requestScopeStorage = createStore<ScopeStorage>();

export async function initializeRequestScopeStorage(
  scope: HttpScope,
  next: NextMiddleware,
  storage: ScopeStore<ScopeStorage> = requestScopeStorage,
): Promise<void> {
  await storage.run({ eventEmitter: scope.app, scope }, next);
}

export function useEmit(storage: ScopeStore<ScopeStorage> = requestScopeStorage): ScopeEventEmitter {
  return storage.get('eventEmitter');
}

export function useRequest(storage: ScopeStore<ScopeStorage> = requestScopeStorage): HttpRequest {
  return storage.get('scope').request;
}

export function useResponse(storage: ScopeStore<ScopeStorage> = requestScopeStorage): HttpResponse {
  return storage.get('scope').response;
}
