import { Context, Next } from 'koa';

export async function viewMiddleware(ctx: Context, next: Next) {
    const view = await next();

    if (view) {
        if (view.status) {
            ctx.response.status = view.status;
        }

        if (view.headers) {
            ctx.response.headers = view.headers;
        }

        if (view.body) {
            ctx.response.body = view.body;
        }

        if (view.socket) {
            ctx.response.socket = view.socket;
        }

        if (view.redirect) {
            ctx.response.redirect(view.redirect);
        }

        if (view.attachment) {
            ctx.response.attachment(view.attachment);
        }
    }
}
