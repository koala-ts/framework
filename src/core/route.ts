import 'reflect-metadata';
import { Handler, IRouteMetadata, THttpMethod, TRouterMethod } from './types';

const key = Symbol('Route');

export function Route(method: THttpMethod, path: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        const routes: IRouteMetadata[] = Reflect.getMetadata(key, Reflect) || [];
        routes.push({
            path,
            methods: qualifyMethod(method),
            middleware: qualifyMiddleware(target, propertyKey),
        });
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

function qualifyMiddleware(target: unknown, propertyKey: string | symbol): Handler {
    if (typeof target === 'function') {
        return target as Handler;
    }
    
    return (target as any)[propertyKey] as Handler;
}
