import Koa, { Context, DefaultState, Next, Request, Response } from 'koa';
import { KoaBodyMiddlewareOptions } from 'koa-body';
import { File } from 'formidable';

export type IApplication<StateT = IState, ScopeT = IScope> = Koa<StateT, ScopeT>;

export interface IState extends DefaultState {
}

export interface IScope extends Context {
    request: IRequest | IHttpRequest;
    response: IResponse;
}

export interface IUploadedFile extends File {
}

export interface IFilesMap {
    [file: string]: IUploadedFile | IUploadedFile[];
}

export interface IRequest extends Request {
    body?: Record<string, any>;
    files?: IFilesMap;
    params: IScope['params'];
}

export interface IHttpRequest extends IRequest {
    body: Record<string, any>;
}

export interface IResponse extends Response {
}

export interface IMiddleware {
    (scope: IScope, next: INext): Promise<INext>;
}

export interface INext extends Next {
}

export interface Handler extends IMiddleware {
}

export type THttpMethod =
    | 'get' | 'post' | 'put' | 'patch' | 'delete'
    | 'options' | 'head' | 'any' | 'all'
    | 'GET' | 'POST' | 'PUT' | 'PATCH'
    | 'DELETE' | 'OPTIONS' | 'HEAD'
    | 'ANY' | 'ALL';

export type TRouterMethod =
    | 'get' | 'post' | 'put' | 'patch'
    | 'delete' | 'options' | 'head' | 'all';

export interface IRouteMetadata {
    path: string;
    methods: TRouterMethod[];
    handler: Handler;
    parseBody: boolean;
    middleware: IMiddleware[];
    bodyOptions: Partial<KoaBodyMiddlewareOptions>;
}

export type IRouteOptions = Partial<KoaBodyMiddlewareOptions & {
    parseBody?: boolean;
}>;

export interface IRoute {
    path: string;
    method: THttpMethod | THttpMethod[];
    middleware?: IMiddleware[];
    options?: IRouteOptions;
}
