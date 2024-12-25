import { Server } from 'http';
import { Middleware } from '@koa/router';

export interface IApplication {
    listen(port?: number): Server;
}

export interface Handler extends Middleware {
}

export type THttpMethod =
    'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
    | 'options'
    | 'head'
    | 'any'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'
    | 'ANY';

export type TRouterMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';

export interface IRouteMetadata {
    path: string;
    methods: TRouterMethod[];
    middleware: Handler;
}
