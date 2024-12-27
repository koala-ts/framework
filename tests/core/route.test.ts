import { describe, expect, test } from 'vitest';
import { getRoutes, Route } from '../../src/core/route';

describe('Route', () => {
    class Foo {
        @Route({ method: 'get', path: '/foo', parseBody: false })
        bar() {
        }
    }

    test('it should track registered routes', () => {
        expect(getRoutes()).toEqual([{
            methods: ['get'],
            handler: Foo.prototype.bar,
            path: '/foo',
            parseBody: false,
        }]);
    });
});
