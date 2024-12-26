import { Server } from 'http';
import { Middleware } from '@koa/router';
import { Response } from 'koa';

export interface IApplication {
    listen(port?: number): Server;
}

export interface View {
    status?: Response['status'];
    headers?: Response['headers'];
    body?: Response['body'];
    socket?: Response['socket'];
    redirect?: Response['redirect'];
    attachment?: Response['attachment'];
}

export interface Handler extends Middleware {
    (): Promise<View> | View;
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
    handler: Handler;
}
