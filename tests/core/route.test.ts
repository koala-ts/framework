import { describe, expect, test, vi } from 'vitest';
import { getRoutes, Route } from '../../src/core/route';

describe('Route', () => {
    const exampleMiddleware = vi.fn();

    class Foo {
        @Route({
            method: 'get',
            path: '/foo',
            parseBody: false,
            middleware: [exampleMiddleware],
        })
        bar() {
        }
    }

    test('it should track registered routes', () => {
        expect(getRoutes()).toEqual([{
            methods: ['get'],
            handler: Foo.prototype.bar,
            path: '/foo',
            parseBody: false,
            middleware: [exampleMiddleware],
        }]);
    });
});
