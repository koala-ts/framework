import { type HttpScope } from '@/Http';

export interface EventEmitter {
  emit(event: string, ...args: unknown[]): void;
}

export interface EventBusStorage {
  eventEmitter: EventEmitter;
  scope: HttpScope;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventSubscriber = (...args: any[]) => void;
