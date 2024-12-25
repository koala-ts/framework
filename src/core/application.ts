import { IApplication } from './types';
import Koa, { Context } from 'koa';
import Router from '@koa/router';
import '../../playground/ExampleController';

export function create(): IApplication {
    const app = new Koa();
    const router = new Router();

    router.get('/', (ctx: Context) => {
        ctx.body = 'Hello, World!';
    });

    app.use(router.routes());
    return app;
}
