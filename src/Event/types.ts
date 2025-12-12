import { type HttpScope } from '@/Http';

export interface EventEmitter {
  emit(event: string, ...args: unknown[]): void;
}

export interface EventBusStorage {
  eventEmitter: EventEmitter;
  scope: HttpScope;
}
