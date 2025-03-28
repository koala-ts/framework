import { IApplication, IRouteMetadata } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import { getRoutes } from './route';
import { IKoalaConfig } from '../config';
import { koaBody } from 'koa-body';
import { extendResponse } from './response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function create(_: IKoalaConfig): IApplication {
    const app = new Koa() as IApplication;
    app.scope = app.context;

    const router = new Router();

    getRoutes()
        .forEach(({
            methods,
            path,
            middleware,
            handler,
            parseBody,
            bodyOptions,
        }: IRouteMetadata) => {
            const middlewareStack = [...middleware, handler];
            methods.forEach(method => {
                const routeMiddleware = parseBody ? [koaBody(bodyOptions), ...middlewareStack] : middlewareStack;
                router[method](path, ...routeMiddleware);
            });
        });

    app.use(extendResponse);
    app.use(router.routes());

    return app;
}
