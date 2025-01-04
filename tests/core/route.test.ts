import { describe, expect, test, vi } from 'vitest';
import { getRoutes, Route } from '../../src';

describe('Route', () => {
    const exampleMiddleware = vi.fn();

    class Foo {
        @Route({
            method: 'get',
            path: '/foo',
            middleware: [exampleMiddleware],
            options: { parseBody: false },
        })
        bar() {
        }

        @Route({
            method: ['get', 'post'],
            path: '/route-with-multiple-methods',
            options: { multipart: true },
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
                bodyOptions: {},
            },
            {
                methods: ['get', 'post'],
                handler: Foo.prototype.routeWithMultipleMethods,
                path: '/route-with-multiple-methods',
                parseBody: true,
                middleware: [],
                bodyOptions: { multipart: true },
            },
            {
                methods: ['all'],
                handler: Foo.prototype.routeWithAnyMethod,
                path: '/route-with-any-method',
                parseBody: true,
                middleware: [],
                bodyOptions: {},
            },
            {
                methods: ['all'],
                handler: Foo.prototype.routeWithAllMethod,
                path: '/route-with-all-method',
                parseBody: true,
                middleware: [],
                bodyOptions: {},
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
            bodyOptions: {},
        });
    });

    test('empty routes', () => {
        Reflect.getMetadata = vi.fn(() => undefined);
        
        expect(getRoutes()).toEqual([]);
    });
});
