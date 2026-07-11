import { describe, expect, test, vi } from 'vitest';
import type { HttpScope } from '@/Http';
import { firewall } from '@/Security/firewall/firewall-middleware';

describe('Firewall Middleware', () => {
  test('it should skip unmatched firewalls', async () => {
    const userProvider = vi.fn();
    const config = {
      firewalls: [
        {
          pattern: '^/admin',
          security: true,
          provider: userProvider,
        },
      ],
    };
    const middleware = firewall(config);
    const next = vi.fn();
    const request = { path: '/public' };

    await middleware({ request } as HttpScope, next);

    expect(userProvider).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('it should skip unsecured firewall', async () => {
    const userProvider = vi.fn();
    const config = {
      firewalls: [
        {
          pattern: '^/public',
          security: false,
          provider: userProvider,
        },
      ],
    };
    const middleware = firewall(config);
    const next = vi.fn();
    const request = { path: '/public' };

    await middleware({ request } as HttpScope, next);

    expect(userProvider).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('it should pass if user is already authenticated', async () => {
    const userProvider = vi.fn();
    const config = {
      firewalls: [
        {
          pattern: '^/admin',
          security: true,
          provider: userProvider,
        },
      ],
    };
    const middleware = firewall(config);
    const next = vi.fn();
    const request = { path: '/admin' };
    const scope = { request, user: { identifier: 'user-1' } } as unknown as HttpScope;

    await middleware(scope, next);

    expect(userProvider).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('it should stop execution if authentication fails', async () => {
    const userProvider = vi.fn().mockResolvedValue(undefined);
    const config = {
      firewalls: [
        {
          pattern: '^/admin',
          security: true,
          provider: userProvider,
        },
      ],
    };
    const middleware = firewall(config);
    const next = vi.fn();
    const request = { path: '/admin' };
    const internalThrow = vi.fn();
    const scope = {
      request,
      throw: internalThrow,
    } as unknown as HttpScope;

    await middleware(scope, next);

    expect(userProvider).toHaveBeenCalled();
    expect(internalThrow).toHaveBeenCalledWith(401, 'Authentication required');
  });
});
