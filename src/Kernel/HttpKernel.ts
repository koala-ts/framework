import {
  createStore,
  type HttpRequest,
  type HttpResponse,
  type HttpScope,
  type NextMiddleware,
  type ScopeStore,
} from '@/Http';
import { type EventEmitter, type KernelStorage } from '@/Kernel/types';

const kernelStorage = createStore<KernelStorage>();

export async function httpKernel(
  scope: HttpScope,
  next: NextMiddleware,
  storage: ScopeStore<KernelStorage> = kernelStorage,
): Promise<void> {
  await storage.run({ eventEmitter: scope.app, scope }, next);
}

export function useEmit(storage: ScopeStore<KernelStorage> = kernelStorage): EventEmitter {
  return storage.get('eventEmitter');
}

export function useRequest(storage: ScopeStore<KernelStorage> = kernelStorage): HttpRequest {
  return storage.get('scope').request;
}

export function useResponse(storage: ScopeStore<KernelStorage> = kernelStorage): HttpResponse {
  return storage.get('scope').response;
}
