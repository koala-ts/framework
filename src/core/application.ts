import { IApplication, IRouteMetadata, TRouterMethod } from './types';
import Koa from 'koa';
import Router from '@koa/router';
import { getRoutes } from './route';
import { viewMiddleware } from './view-middleware';
import * as fs from 'node:fs';
import { configDefaults } from '../config/defaults';
import { get } from 'stack-trace';
import { dirname } from 'node:path';
import { IControllersConfiguration } from '../config/types';

export async function create(): Promise<IApplication> {
    const rootDir = rootDirectory();

    await loadControllers(configDefaults.controllers, rootDir);

    const app = new Koa();
    app.use(viewMiddleware);

    const router = new Router();

    getRoutes().forEach((route: IRouteMetadata) => {
        route.methods.forEach((method: TRouterMethod) => {
            router[method](route.path, route.handler);
        });
    });

    app.use(router.routes());

    return app;
}

function rootDirectory(): string {
    const trace = get();
    try {
        const url = new URL(trace[2].getFileName());
        return dirname(url.pathname);
    } catch (e) {
        return process.cwd();
    }
}

async function loadControllers({ path }: IControllersConfiguration, rootDir: string): Promise<void> {
    const fullPath = path.replace('<rootDir>', rootDir);

    if (!fs.existsSync(fullPath)) {
        return;
    }

    const files: string[] = fs.readdirSync(fullPath);

    for (const file of files) {
        const fileExtension = file.split('.').pop();

        if (fileExtension !== 'ts' && fileExtension !== 'js') {
            continue;
        }
        
        if (!file.match(/.*Controller\.(ts|js)$/)) {
            continue;
        }

        await import((`${fullPath}/${file}`));
    }
}
