import { describe, expect, test, vi } from 'vitest';
import { create, INext, type IScope, Route } from '../../src/core';
import Koa from 'koa';
import { koalaDefaultConfig } from '../../src/config';
import { testAgent } from '../../src/testing';

describe('Application', () => {
    const middleware1 = function (_: IScope, next: INext) {
        return next();
    };
    const service = vi.fn();

    const middleware2 = function (_: IScope, next: INext) {
        service();
        return next();
    };


    class FooController {
        @Route({ method: 'any', path: '/bar', parseBody: false, middleware: [middleware1, middleware2] })
        bar(scope: IScope): void {
            scope.response.body = {
                name: scope.request.body?.name || 'Koala'
            };
        }

        @Route({ method: 'post', path: '/qux' })
        qux(scope: IScope): void {
            scope.response.body = scope.request.body;
        }
    }

    test('it creates application instance', () => {
        const app = create(koalaDefaultConfig);

        expect(app).toBeInstanceOf(Koa);
    });

    test('e2e with body', async () => {
        const agent = testAgent(koalaDefaultConfig);

        const response = await agent.post('/qux').send({ name: 'Koala' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ name: 'Koala' });
    });

    test('e2e without body', async () => {
        const agent = testAgent(koalaDefaultConfig);

        const response = await agent.get('/bar').send({ name: 'Not Koala' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ name: 'Koala' });
    });

    test('it should call middleware', async () => {
        const agent = testAgent(koalaDefaultConfig);

        await agent.get('/bar');

        expect(service).toHaveBeenCalled();
    });
});
