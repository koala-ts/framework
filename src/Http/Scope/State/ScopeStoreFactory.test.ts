import { describe, expect, test, vi } from 'vitest';
import { createStore } from './ScopeStoreFactory';

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
    }).toThrowError(
      'No active scope store found. Make sure to call set() within a run() context.',
    );
  });

  test('get should fail if no active store found', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.get('id');
    }).toThrowError(
      'No active scope store found. Make sure to call get() within a run() context.',
    );
  });

  test('all should fail if no active store found', () => {
    const store = createStore<{ id: number }>();

    expect(() => {
      store.all();
    }).toThrowError(
      'No active scope store found. Make sure to call all() within a run() context.',
    );
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
});
