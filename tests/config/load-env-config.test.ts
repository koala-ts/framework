import { describe, expect, test, vi } from 'vitest';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { loadEnvConfig } from '../../src';

describe('Load env config', () => {
    const configSpy = vi.spyOn(dotenv, 'config');
    const expandSpy = vi.spyOn(dotenvExpand, 'expand');

    test('it should load .env file', () => {
        loadEnvConfig('development');

        expect(configSpy).toHaveBeenCalledWith({ path: expect.stringContaining('.env'), override: true });
        expect(expandSpy).toHaveBeenCalled();
    });

    test('it should load .env.local file', () => {
        loadEnvConfig('development');

        expect(configSpy).toHaveBeenCalledWith({ path: expect.stringContaining('.env.local'), override: true });
        expect(expandSpy).toHaveBeenCalled();
    });

    test('it should not load .env.local file in test environment', () => {
        loadEnvConfig('test');

        expect(configSpy).not.toHaveBeenCalledWith(expect.stringContaining('.env.local'));
    });

    test('it should load .env.<env> file', () => {
        loadEnvConfig('development');

        expect(configSpy).toHaveBeenCalledWith({ path: expect.stringContaining('.env.development'), override: true });
        expect(expandSpy).toHaveBeenCalled();
    });

    test('it should load .env.<env>.local file', () => {
        loadEnvConfig('test');

        expect(configSpy).toHaveBeenCalledWith({ path: expect.stringContaining('.env.test.local'), override: true });
        expect(expandSpy).toHaveBeenCalled();
    });
});
