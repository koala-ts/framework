import { IncomingMessage, Server, ServerResponse } from 'http';
import { Middleware } from '@koa/router';
import { Request, Response } from 'koa';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export interface IApplication {
    listen(port?: number): Server;

    callback(): (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => Promise<void>;
}

export interface IHttpRequest extends Request {
    body: { [key: string]: any };
}

export interface IRequest extends Request {
    body?: { [key: string]: any };
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
    parseBody: boolean;
}

export interface IRouteOptions {
    path: string;
    method: THttpMethod;
    parseBody?: boolean;
}
