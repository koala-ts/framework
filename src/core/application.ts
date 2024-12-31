import { IApplication, IRouteMetadata } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import { getRoutes } from './route';
import { IKoalaConfig } from '../config';
import { koaBody } from 'koa-body';

export function create(_: IKoalaConfig): IApplication {
    const app = new Koa();
    const router = new Router();

    getRoutes().forEach(({ methods, path, middleware, handler, parseBody }: IRouteMetadata) => {
        const middlewareStack = [...middleware, handler];
        methods.forEach(method => {
            const routeMiddleware = parseBody ? [koaBody(), ...middlewareStack] : middlewareStack;
            router[method](path, ...routeMiddleware);
        });
    });

    app.use(router.routes());
    return app;
}
