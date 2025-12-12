import { type HttpScope } from '@/Http';

export interface EventEmitter {
  emit(event: string, ...args: unknown[]): void;
}

export interface EventBusStorage {
  eventEmitter: EventEmitter;
  scope: HttpScope;
}

export type EventSubscriber<T extends unknown[] = unknown[]> = (...args: T) => void;
