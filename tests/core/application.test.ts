import { describe, expect, test } from 'vitest';
import { create } from '../../src/core/application';
import Koa from 'koa';
import { Route } from '../../src/core/route';
import { koalaDefaultConfig } from '../../src/config';
import { type View } from '../../src/core/types';
import { testAgent } from '../../src/testing';

describe('Application', () => {
    class FooController {
        @Route('any', '/foo')
        bar(): View {
            return {
                status: 200,
                body: 'Koala is awesome!',
            };
        }
    }

    test('it creates application instance', () => {
        const app = create(koalaDefaultConfig);

        expect(app).toBeInstanceOf(Koa);
    });

    test('e2e', async () => {
        const agent = testAgent(koalaDefaultConfig);

        const response = await agent.get('/foo');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Koala is awesome!');
    });
});
