export class ScopeStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScopeStoreError';
  }
}

export interface ScopeStore<TState extends object> {
  run<TResult>(initialState: TState, callback: () => TResult): TResult;

  set<TKey extends keyof TState>(key: TKey, value: TState[TKey]): void;

  get<TKey extends keyof TState>(key: TKey): TState[TKey];

  has(key: keyof TState): boolean;

  all(): TState;
}
