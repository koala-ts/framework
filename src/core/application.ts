import { IApplication } from './types';
import Koa, { Context } from 'koa';
import Router from '@koa/router';
import { get as trace } from 'stack-trace';
import * as path from 'node:path';
import { fileURLToPath } from 'url';
import '../../playground/ExampleController';

export function create(): IApplication {
    const app = new Koa();
    const router = new Router();

    const rootDir = path.dirname(fileURLToPath((trace())[1].getFileName()));

    router.get('/', (ctx: Context) => {
        ctx.body = 'Hello, World!';
    });

    app.use(router.routes());
    return app;
}
