import { describe, expect, test } from 'vitest';
import { create } from '../../src/core/application';
import Koa from 'koa';
import { Route } from '../../src/core/route';
import { koalaDefaultConfig } from '../../src/config';

describe('Application', () => {
    class FooController {
        @Route('any', '/foo')
        bar() {
        }
    }

    test('it creates application instance', () => {
        const app = create(koalaDefaultConfig);

        expect(app).toBeInstanceOf(Koa);
    });
});
