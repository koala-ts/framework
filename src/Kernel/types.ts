import type { HttpScope } from '@/Http';

export interface EventEmitter {
  emit(event: string, ...args: unknown[]): void;
}

export interface KernelStorage {
  eventEmitter: EventEmitter;
  scope: HttpScope;
}

// biome-ignore lint/suspicious/noExplicitAny: Event subscribers accept arbitrary event arguments.
export type EventSubscriber = (...args: any[]) => void | Promise<void>;
