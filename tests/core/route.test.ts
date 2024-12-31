import { describe, expect, test, vi } from 'vitest';
import { getRoutes, Route } from '../../src';

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

        @Route({
            method: ['get', 'post'],
            path: '/route-with-multiple-methods',
        })
        routeWithMultipleMethods() {
        }

        @Route({
            method: 'any',
            path: '/route-with-any-method',
        })
        routeWithAnyMethod() {
        }

        @Route({
            method: 'all',
            path: '/route-with-all-method',
        })
        routeWithAllMethod() {
        }
    }

    test('it should track registered routes', () => {
        expect(getRoutes()).toEqual([
            {
                methods: ['get'],
                handler: Foo.prototype.bar,
                path: '/foo',
                parseBody: false,
                middleware: [exampleMiddleware],
            },
            {
                methods: ['get', 'post'],
                handler: Foo.prototype.routeWithMultipleMethods,
                path: '/route-with-multiple-methods',
                parseBody: true,
                middleware: [],
            },
            {
                methods: ['all'],
                handler: Foo.prototype.routeWithAnyMethod,
                path: '/route-with-any-method',
                parseBody: true,
                middleware: [],
            },
            {
                methods: ['all'],
                handler: Foo.prototype.routeWithAllMethod,
                path: '/route-with-all-method',
                parseBody: true,
                middleware: [],
            }
        ]);
    });

    test('it handles functions as handlers', () => {
        const target = vi.fn();
        Route({ path: '/fn-path', method: 'any' })(target, 'fn', {});

        const routes = getRoutes();

        expect(routes).toContainEqual({
            methods: ['all'],
            handler: target,
            middleware: [],
            parseBody: true,
            path: '/fn-path',
        });
    });
});
