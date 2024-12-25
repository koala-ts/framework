import { IApplication, IApplicationOptions } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import '../../playground/HomeController';
import { getRoutes, RouteMetadata } from '../decorator/route';

export function create({}: IApplicationOptions = { controllers: [] }): IApplication {
    const app = new Koa();
    const router = new Router();

    const routeList: RouteMetadata[] = getRoutes();
    routeList.forEach((route: RouteMetadata) => {
        const methodIndex = route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
        router[methodIndex](route.path, route.middleware);
    });

    app.use(router.routes());

    return app;
}
