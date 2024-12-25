import 'reflect-metadata';
import { Handler, IRouteMetadata, THttpMethod, TRouterMethod } from './types';

const key = Symbol('Route');

export function Route(method: THttpMethod, path: string): MethodDecorator {
    return function (middleware: Object): void {
        const routes: IRouteMetadata[] = Reflect.getMetadata(key, Reflect) || [];
        routes.push({ path, methods: qualifyMethod(method), middleware: middleware as Handler });
        Reflect.defineMetadata(key, routes, Reflect);
    };
}

export function getRoutes(): IRouteMetadata[] {
    return Reflect.getMetadata(key, Reflect) || [];
}

function qualifyMethod(method: THttpMethod): TRouterMethod[] {
    const lowerMethod = method.toLowerCase();

    if (lowerMethod === 'any') {
        return ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
    }

    return [lowerMethod as TRouterMethod];
}
