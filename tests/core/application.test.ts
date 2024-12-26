import { describe, expect, test } from 'vitest';
import { create } from '../../src/core/application';
import Koa from 'koa';

describe('Application', () => {
    test('it creates application instance', () => {
        const app = create();

        expect(app).toBeInstanceOf(Koa);
    });
});
