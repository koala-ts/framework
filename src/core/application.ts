import { IApplication } from './types';
import Koa from 'koa';

export function create(): IApplication {
    return new Koa();
}
