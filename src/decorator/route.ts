import 'reflect-metadata';
import { Middleware } from '@koa/router';

const key = Symbol('Route');

export interface RouteMetadata {
    path: string;
    method: string;
    middleware: Middleware;
}

export function Route(method: string, path: string): MethodDecorator {
    return function (middleware: Object) {
        const routes: RouteMetadata[] = Reflect.getMetadata(key, Reflect) || [];
        routes.push({ path, method, middleware: middleware as Middleware });
        Reflect.defineMetadata(key, routes, Reflect);
    };
}

export function getRoutes(): RouteMetadata[] {
    return Reflect.getMetadata(key, Reflect) || [];
}
