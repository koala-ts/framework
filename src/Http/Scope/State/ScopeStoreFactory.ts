import { AsyncLocalStorage } from 'node:async_hooks';
import { type ScopeState, type ScopeStore } from './types';

export function createStore<TState extends ScopeState>(): ScopeStore<TState> {
  const asyncLocalStorage = new AsyncLocalStorage<TState>();

  function run<TResult>(initialState: TState, callback: () => TResult): TResult {
    return asyncLocalStorage.run(initialState, callback);
  }

  function set<TKey extends keyof TState>(key: TKey, value: TState[TKey]): void {
    const state = asyncLocalStorage.getStore();

    if (undefined === state) throw new ReferenceError('No active scope store found. Make sure to call set() within a run() context.');

    state[key] = value;
  }

  function get<TKey extends keyof TState>(key: TKey): TState[TKey] {
    const state = asyncLocalStorage.getStore();

    if (undefined === state) throw new ReferenceError('No active scope store found. Make sure to call get() within a run() context.');

    return state[key];
  }

  function all(): TState {
    const store: TState | undefined = asyncLocalStorage.getStore();

    if (undefined === store) throw new ReferenceError('No active scope store found. Make sure to call all() within a run() context.');

    return store;
  }

  return {
    run,
    set,
    get,
    all,
  };
}
