import 'reflect-metadata';
import { Handler, IRoute, IRouteMetadata, THttpMethod, TRouterMethod } from './types';

const key = Symbol('Route');

export function Route({ method, path, middleware = [], options = {} }: IRoute): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        const routes: IRouteMetadata[] = Reflect.getMetadata(key, Reflect) || [];
        const { parseBody, ...bodyOptions } = options;

        routes.push({
            path,
            methods: qualifyMethod(method),
            handler: qualifyHandler(target, propertyKey),
            parseBody: options.parseBody ?? true,
            middleware: middleware,
            bodyOptions: bodyOptions,
        });

        Reflect.defineMetadata(key, routes, Reflect);
    };
}

export function getRoutes(): IRouteMetadata[] {
    return Reflect.getMetadata(key, Reflect) ?? [];
}

function qualifyMethod(method: THttpMethod | THttpMethod[]): TRouterMethod[] {
    const methods = Array.isArray(method) ? method : [method];
    return methods.flatMap(m => ['any', 'all'].includes(m.toLowerCase()) ? ['all'] : [m.toLowerCase() as TRouterMethod]);
}

function qualifyHandler(target: unknown, propertyKey: string | symbol): Handler {
    if (typeof target === 'function') {
        return target as Handler;
    }

    return (target as any)[propertyKey] as Handler;
}
