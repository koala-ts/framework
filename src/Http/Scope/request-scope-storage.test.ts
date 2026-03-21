import { describe, expect, test, vi } from 'vitest';
import { type HttpScope, type ScopeStore } from '@/Http';
import {
  initializeRequestScopeStorage,
  type ScopeStorage,
  useEmit,
  useRequest,
  useResponse,
} from './request-scope-storage';

describe('request scope storage', () => {
  test('middleware should init storage', async () => {
    const scope = { app: vi.fn() };
    const next = vi.fn();
    const storage = { run: vi.fn() };

    await initializeRequestScopeStorage(
      scope as unknown as HttpScope,
      next,
      storage as unknown as ScopeStore<ScopeStorage>,
    );

    expect(storage.run).toHaveBeenCalledWith({ eventEmitter: scope.app, scope }, next);
  });

  test('useEmit should return emitter from storage', () => {
    const storage = { get: vi.fn().mockReturnValue('eventEmitter') };

    const emitter = useEmit(storage as unknown as ScopeStore<ScopeStorage>);

    expect(storage.get).toHaveBeenCalledWith('eventEmitter');
    expect(emitter).toBe('eventEmitter');
  });

  test('useRequest should return request from storage', () => {
    const request = { headers: { host: 'localhost' } };
    const storage = { get: vi.fn().mockReturnValue({ request }) };

    const req = useRequest(storage as unknown as ScopeStore<ScopeStorage>);

    expect(storage.get).toHaveBeenCalledWith('scope');
    expect(req).toBe(request);
  });

  test('useResponse should return response from storage', () => {
    const response = { status: 200, body: 'OK' };
    const storage = { get: vi.fn().mockReturnValue({ response }) };

    const res = useResponse(storage as unknown as ScopeStore<ScopeStorage>);

    expect(storage.get).toHaveBeenCalledWith('scope');
    expect(res).toBe(response);
  });
});
