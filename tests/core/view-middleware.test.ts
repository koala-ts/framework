import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Context, Next } from 'koa';
import { viewMiddleware } from '../../src/core/view-middleware';

describe('View Middleware', () => {
    let ctx: Context;

    beforeEach(() => {
        ctx = {
            response: {},
        } as Context;
    });

    test('it should set response status', async () => {
        const next: Next = vi.fn().mockResolvedValue({ status: 200 });

        await viewMiddleware(ctx, next);

        expect(ctx.response.status).toBe(200);
    });

    test('it should set response headers', async () => {
        const next: Next = vi.fn().mockResolvedValue({ headers: { 'Content-Type': 'application/json' } });

        await viewMiddleware(ctx, next);

        expect(ctx.response.headers).toEqual({ 'Content-Type': 'application/json' });
    });

    test('it should set response body', async () => {
        const next: Next = vi.fn().mockResolvedValue({ body: 'Hello, World!' });

        await viewMiddleware(ctx, next);

        expect(ctx.response.body).toBe('Hello, World!');
    });

    test('it should set response socket', async () => {
        const next: Next = vi.fn().mockResolvedValue({ socket: 'socket' });

        await viewMiddleware(ctx, next);

        expect(ctx.response.socket).toBe('socket');
    });

    test('it should redirect if view has redirect', async () => {
        const next: Next = vi.fn().mockResolvedValue({ redirect: '/home' });
        ctx.response.redirect = vi.fn();

        await viewMiddleware(ctx, next);

        expect(ctx.response.redirect).toHaveBeenCalledWith('/home');
    });

    test('it should attach if view has attachment', async () => {
        const next: Next = vi.fn().mockResolvedValue({ attachment: 'file.txt' });
        ctx.response.attachment = vi.fn();

        await viewMiddleware(ctx, next);
        
        expect(ctx.response.attachment).toHaveBeenCalledWith('file.txt');
    });
});
