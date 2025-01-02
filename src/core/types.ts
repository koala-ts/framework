import { IncomingMessage, Server, ServerResponse } from 'http';
import { Middleware } from '@koa/router';
import { Context, Next, Request, Response, } from 'koa';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export interface IApplication {
    listen(port?: number): Server;

    callback(): (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => Promise<void>;
}

export interface IRequest extends Request {
    body?: { [key: string]: any };
}

export interface IHttpRequest extends IRequest {
    body: { [key: string]: any };
}


export interface IResponse extends Response {
}

export interface IScope extends Context {
    request: IRequest | IHttpRequest;
    response: IResponse;
}

export interface INext extends Next {
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
    | 'all'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'
    | 'ANY'
    | 'ALL';

export type TRouterMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'all';

export interface IRouteMetadata {
    path: string;
    methods: TRouterMethod[];
    handler: Handler;
    parseBody: boolean;
    middleware: Middleware[];
}

export interface IRouteOptions {
    path: string;
    method: THttpMethod | THttpMethod[];
    parseBody?: boolean;
    middleware?: Middleware[];
}
