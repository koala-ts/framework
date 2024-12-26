import { IApplication, IRouteMetadata, TRouterMethod } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import { getRoutes } from './route';
import { viewMiddleware } from './view-middleware';
import { IKoalaConfig } from '../config/types';

export function create(_: IKoalaConfig): IApplication {
    const app = new Koa();
    app.use(viewMiddleware);

    const router = new Router();

    getRoutes().forEach((route: IRouteMetadata) => {
        route.methods.forEach((method: TRouterMethod) => {
            router[method](route.path, route.handler);
        });
    });

    app.use(router.routes());

    return app;
}
