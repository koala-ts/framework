import { type INext, IResponse, type IScope } from './types';

export async function extendResponse(scope: IScope, next: INext): Promise<void> {
    scope.response.setHeader = function (name: string, value: string | string[]): IResponse {
        scope.set(name, value);
        
        return this;
    };


    scope.response.withHeaders = function (headers: Record<string, string | string[]>): IResponse {
        Object.entries(headers).forEach(([name, value]) => {
            scope.set(name, value);
        });

        return this;
    };

    await next();
}
