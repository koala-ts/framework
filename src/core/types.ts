import { Middleware } from '@koa/router';
import Koa, { Context, DefaultState, Next, Request, Response, } from 'koa';

export type IApplication<StateT = IState, ScopeT = IScope> = Koa<StateT, ScopeT>;

export interface IState extends DefaultState {
}

export interface IScope extends Context {
    request: IRequest | IHttpRequest;
    response: IResponse;
}

export interface IRequest extends Request {
    body?: { [key: string]: any };
}

export interface IHttpRequest extends IRequest {
    body: { [key: string]: any };
}

export interface IResponse extends Response {
}


export interface IMiddleware extends Middleware {
    (scope: IScope, next: INext): Promise<INext>;
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
    middleware: IMiddleware[];
}

export interface IRouteOptions {
    path: string;
    method: THttpMethod | THttpMethod[];
    parseBody?: boolean;
    middleware?: IMiddleware[];
}
