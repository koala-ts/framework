import { describe, expect, test } from 'vitest';
import { getRoutes, Route } from '../../src/core/route';

describe('Route', () => {
    class Foo {
        @Route('get', '/foo')
        bar() {
        }
    }

    test('it should track registered routes', () => {
        expect(getRoutes()).toEqual([{
            methods: ['get'],
            middleware: Foo.prototype.bar,
            path: '/foo',
        }]);
    });
});
