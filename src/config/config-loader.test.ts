import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { loadEnvConfig } from '@/config';

describe('load env config', () => {
  const configSpy = vi.spyOn(dotenv, 'config');
  const expandSpy = vi.spyOn(dotenvExpand, 'expand');

  beforeEach(() => {
    vi.clearAllMocks();
    configSpy.mockReturnValue({ parsed: {} });
    expandSpy.mockReturnValue({ parsed: {} });
  });

  test('loads environment files in development order', () => {
    loadEnvConfig('development');

    expect(configSpy).toHaveBeenNthCalledWith(1, {
      path: expect.stringContaining('.env'),
      override: true,
      quiet: true,
    });
    expect(configSpy).toHaveBeenNthCalledWith(2, {
      path: expect.stringContaining('.env.local'),
      override: true,
      quiet: true,
    });
    expect(configSpy).toHaveBeenNthCalledWith(3, {
      path: expect.stringContaining('.env.development'),
      override: true,
      quiet: true,
    });
    expect(configSpy).toHaveBeenNthCalledWith(4, {
      path: expect.stringContaining('.env.development.local'),
      override: true,
      quiet: true,
    });
  });

  test('skips the shared local file in the test environment', () => {
    loadEnvConfig('test');

    expect(configSpy).toHaveBeenCalledTimes(3);

    expect(configSpy).toHaveBeenNthCalledWith(1, {
      path: expect.stringContaining('.env'),
      override: true,
      quiet: true,
    });
    expect(configSpy).toHaveBeenNthCalledWith(2, {
      path: expect.stringContaining('.env.test'),
      override: true,
      quiet: true,
    });
    expect(configSpy).toHaveBeenNthCalledWith(3, {
      path: expect.stringContaining('.env.test.local'),
      override: true,
      quiet: true,
    });
  });

  test('uses the framework dotenv defaults for every file', () => {
    loadEnvConfig('development');

    expect(configSpy).toHaveBeenCalledTimes(4);

    expect(configSpy.mock.calls).toEqual([
      [{ path: expect.stringContaining('.env'), override: true, quiet: true }],
      [{ path: expect.stringContaining('.env.local'), override: true, quiet: true }],
      [{ path: expect.stringContaining('.env.development'), override: true, quiet: true }],
      [{ path: expect.stringContaining('.env.development.local'), override: true, quiet: true }],
    ]);
  });

  test('uses the provided dotenv options for every file', () => {
    loadEnvConfig('development', {
      debug: true,
      encoding: 'latin1',
      override: false,
      quiet: false,
    });

    expect(configSpy).toHaveBeenCalledTimes(4);

    expect(configSpy).toHaveBeenNthCalledWith(1, {
      debug: true,
      encoding: 'latin1',
      override: false,
      path: expect.stringContaining('.env'),
      quiet: false,
    });
    expect(configSpy).toHaveBeenNthCalledWith(2, {
      debug: true,
      encoding: 'latin1',
      override: false,
      path: expect.stringContaining('.env.local'),
      quiet: false,
    });
    expect(configSpy).toHaveBeenNthCalledWith(3, {
      debug: true,
      encoding: 'latin1',
      override: false,
      path: expect.stringContaining('.env.development'),
      quiet: false,
    });
    expect(configSpy).toHaveBeenNthCalledWith(4, {
      debug: true,
      encoding: 'latin1',
      override: false,
      path: expect.stringContaining('.env.development.local'),
      quiet: false,
    });
  });

  test('preserves framework defaults when no dotenv options are provided', () => {
    loadEnvConfig('development', undefined);

    expect(configSpy).toHaveBeenNthCalledWith(1, {
      path: expect.stringContaining('.env'),
      override: true,
      quiet: true,
    });
  });

  test('expands variables after each file is loaded', () => {
    loadEnvConfig('development');

    expect(expandSpy).toHaveBeenCalledTimes(4);
    expect(expandSpy).toHaveBeenNthCalledWith(1, { parsed: {} });
    expect(expandSpy).toHaveBeenNthCalledWith(2, { parsed: {} });
    expect(expandSpy).toHaveBeenNthCalledWith(3, { parsed: {} });
    expect(expandSpy).toHaveBeenNthCalledWith(4, { parsed: {} });
  });
});
