import { describe, expect, test, vi } from 'vitest';
import { createStore } from './ScopeStoreFactory';
import { ScopeStoreError } from './types';

describe('createStore', () => {
  test('create a store & run', () => {
    const store = createStore<{ id: number }>();
    const callback = vi.fn();

    store.run({ id: 1 }, callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('set should fail if no active store found', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.set('id', 2);
    }).toThrow(ScopeStoreError);
    expect(() => {
      store.set('id', 2);
    }).toThrow('No active scope store found. Make sure to call set() within a run() context.');
  });

  test('get should fail if no active store found', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.get('id');
    }).toThrow(ScopeStoreError);
  });

  test('has should fail if no active store found', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.has('id');
    }).toThrow(ScopeStoreError);
  });

  test('all should fail if no active store found', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.all();
    }).toThrow(ScopeStoreError);
  });

  test('set, get and all should work with active store', () => {
    const store = createStore<{ id: number }>();

    store.run({ id: 1 }, () => {
      expect(store.get('id')).toBe(1);

      store.set('id', 2);
      expect(store.get('id')).toBe(2);

      expect(store.all()).toEqual({ id: 2 });
    });
  });

  test('has() returns true for existing keys', () => {
    const store = createStore<{ id: number; name?: string }>();

    store.run({ id: 1 }, () => {
      expect(store.has('id')).toBe(true);
    });
  });

  test('has() returns true for undefined values', () => {
    const store = createStore<{ id: number; name?: string }>();

    store.run({ id: 1, name: undefined }, () => {
      expect(store.has('name')).toBe(true);
    });
  });

  test('initial state is cloned to prevent external mutation', () => {
    const store = createStore<{ id: number; data: { count: number } }>();
    const initialState = { id: 1, data: { count: 0 } };

    store.run(initialState, () => {
      store.set('id', 2);
      expect(store.get('id')).toBe(2);
    });

    expect(initialState.id).toBe(1);
  });

  test('all() returns a clone to prevent external mutation', () => {
    const store = createStore<{ id: number }>();

    store.run({ id: 1 }, () => {
      const snapshot = store.all();
      snapshot.id = 999;

      expect(store.get('id')).toBe(1);
    });
  });

  test('nested runs maintain separate contexts', () => {
    const store = createStore<{ id: number }>();
    const results: number[] = [];

    store.run({ id: 1 }, () => {
      results.push(store.get('id'));

      store.run({ id: 2 }, () => {
        results.push(store.get('id'));
      });

      results.push(store.get('id'));
    });

    expect(results).toEqual([1, 2, 1]);
  });

  test('concurrent runs maintain isolation', async () => {
    const store = createStore<{ id: number }>();
    const results: number[] = [];

    const promise1 = Promise.resolve().then(() =>
      store.run({ id: 1 }, () => {
        results.push(store.get('id'));
        return store.get('id');
      }),
    );

    const promise2 = Promise.resolve().then(() =>
      store.run({ id: 2 }, () => {
        results.push(store.get('id'));
        return store.get('id');
      }),
    );

    const [result1, result2] = await Promise.all([promise1, promise2]);
    expect(result1).toBe(1);
    expect(result2).toBe(2);
    expect(results).toHaveLength(2);
  });

  test('run() returns callback result', () => {
    const store = createStore<{ id: number }>();

    const result = store.run({ id: 1 }, () => {
      return 'success';
    });

    expect(result).toBe('success');
  });

  test('run() propagates errors from callback', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.run({ id: 1 }, () => {
        throw new Error('callback error');
      });
    }).toThrow('callback error');
  });

  test('supports complex state types', () => {
    interface ComplexState {
      user: { id: number; email: string };
      metadata: Record<string, unknown>;
      tags: string[];
    }

    const store = createStore<ComplexState>();

    store.run(
      {
        user: { id: 1, email: 'test@example.com' },
        metadata: { timestamp: Date.now() },
        tags: ['a', 'b'],
      },
      () => {
        expect(store.get('user')).toEqual({ id: 1, email: 'test@example.com' });
        expect(store.get('tags')).toEqual(['a', 'b']);
        expect(store.has('metadata')).toBe(true);

        store.set('tags', ['c', 'd']);
        expect(store.get('tags')).toEqual(['c', 'd']);
      },
    );
  });
});
