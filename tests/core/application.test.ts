import { describe, expect, test } from 'vitest';
import { create } from '../../src/core/application';
import Koa from 'koa';
import { Route } from '../../src/core/route';
import { koalaDefaultConfig } from '../../src/config';
import { type IContext, type View } from '../../src/core/types';
import { testAgent } from '../../src/testing';

describe('Application', () => {
    class FooController {
        @Route({ method: 'any', path: '/bar', parseBody: false })
        bar(ctx: IContext): View {
            return {
                status: 200,
                body: {
                    name: ctx.request.body?.name || 'Koala'
                },
            };
        }

        @Route({ method: 'post', path: '/qux' })
        qux(ctx: IContext): View {
            return {
                status: 200,
                body: ctx.request.body,
            };
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
});
