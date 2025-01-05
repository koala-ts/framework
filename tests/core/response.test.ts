import { beforeEach, describe, expect, test, vi } from 'vitest';
import { INext, IScope } from '../../src';
import { extendResponse } from '../../src/core/response';

describe('Response', () => {
    describe('Extend response', () => {
        let scope: IScope;
        let next: INext;

        beforeEach(() => {
            scope = { response: {}, set: vi.fn() } as unknown as IScope;
            next = vi.fn();
        });

        test('it should extend response with setHeader method', async () => {
            await extendResponse(scope, next);

            scope.response.setHeader('Content-Type', 'application/json');

            expect(scope.set).toHaveBeenCalledWith('Content-Type', 'application/json');
        });

        test('response.setHeader should is chainable', async () => {
            await extendResponse(scope, next);

            const response = scope.response.setHeader('Content-Type', 'application/json');

            expect(response).toBe(scope.response);
        });

        test('it should extend response with withHeaders method', async () => {
            await extendResponse(scope, next);

            scope.response.withHeaders({
                'Content-Type': 'application/json',
                'X-Custom-Header': 'value',
            });

            expect(scope.set).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(scope.set).toHaveBeenCalledWith('X-Custom-Header', 'value');
        });

        test('response.withHeaders is chainable', async () => {
            await extendResponse(scope, next);

            const response = scope.response.withHeaders({
                'Content-Type': 'application/json',
                'X-Custom-Header': 'value',
            });

            expect(response).toBe(scope.response);
        });
    });
});
