import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create, INext, type IScope, koalaDefaultConfig, Route, testAgent } from '../../src';
import Koa from 'koa';
import TestAgent from 'supertest/lib/agent';

describe('Application', () => {
    let agent: TestAgent;
    beforeEach(() => {
        agent = testAgent(koalaDefaultConfig);
    });

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

        @Route({ method: ['get', 'post'], path: '/handle-multiple-methods' })
        handleMultipleMethods(scope: IScope): void {
            scope.response.body = { method: scope.request.method };
        }

        @Route({ method: 'get', path: '/access-route-params/:id' })
        accessRouteParams(scope: IScope): void {
            scope.response.body = { id: scope.request.params.id };
        }
    }

    test('it creates application instance', () => {
        const app = create(koalaDefaultConfig);

        expect(app).toBeInstanceOf(Koa);
    });

    test('e2e with body', async () => {
        const response = await agent.post('/qux').send({ name: 'Koala' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ name: 'Koala' });
    });

    test('e2e without body', async () => {
        const response = await agent.get('/bar').send({ name: 'Not Koala' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ name: 'Koala' });
    });

    test('it should call middleware', async () => {
        await agent.get('/bar');

        expect(service).toHaveBeenCalled();
    });

    test('it should handle multiple methods', async () => {
        const response1 = await agent.get('/handle-multiple-methods');
        const response2 = await agent.post('/handle-multiple-methods');

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response1.body).toEqual({ method: 'GET' });
        expect(response2.body).toEqual({ method: 'POST' });
    });

    test('it should access route params', async () => {
        const id = '123';
        const response = await agent.get(`/access-route-params/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id });
    });
});
