import { IApplication, IRouteMetadata } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import { getRoutes } from './route';
import { viewMiddleware } from './view-middleware';
import { IKoalaConfig } from '../config/types';
import { koaBody } from 'koa-body';

export function create(_: IKoalaConfig): IApplication {
    const app = new Koa();
    app.use(viewMiddleware);

    const router = new Router();

    getRoutes().forEach((route: IRouteMetadata) => {
        const middlewareStack = [...route.middleware, route.handler];
        for (const method of route.methods) {
            if (route.parseBody) {
                router[method](route.path, koaBody(), ...middlewareStack);
                continue;
            }
            router[method](route.path, ...middlewareStack);
        }
    });

    app.use(router.routes());

    return app;
}
