import { IApplication, IApplicationOptions, IRouteMetadata } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import '../../playground/HomeController';
import { getRoutes } from './route';

export function create({}: IApplicationOptions = { controllers: [] }): IApplication {
    const app = new Koa();
    const router = new Router();

    const routeList: IRouteMetadata[] = getRoutes();
    routeList.forEach((route: IRouteMetadata) => {
        route.methods.forEach((method) => {
            router[method](route.path, route.middleware);
        });
    });

    app.use(router.routes());

    return app;
}
