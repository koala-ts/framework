import { IApplication, IRouteMetadata, TRouterMethod } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import { getRoutes } from './route';

export function create(): IApplication {
    const app = new Koa();
    const router = new Router();

    getRoutes().forEach((route: IRouteMetadata) => {
        route.methods.forEach((method: TRouterMethod) => {
            router[method](route.path, route.middleware);
        });
    });

    app.use(router.routes());

    return app;
}
