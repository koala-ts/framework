export type ScopeState = Record<string, unknown>;

export interface ScopeStore<TState extends ScopeState> {
  run<TResult>(initialState: TState, callback: () => TResult): TResult;

  set<TKey extends keyof TState>(key: TKey, value: TState[TKey]): void;

  get<TKey extends keyof TState>(key: TKey): TState[TKey];

  all(): TState;
}
