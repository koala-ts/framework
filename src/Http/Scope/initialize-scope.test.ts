import { type Application } from '@/application';
import { type HttpScope } from '@/Http';
import { type Next } from 'koa';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { initializeScope } from './initialize-scope';

describe('initializeScope', () => {
  let scope: HttpScope;
  let next: Next;

  beforeEach(() => {
    scope = { app: { context: {} } as Application, response: {}, set: vi.fn() } as unknown as HttpScope;
    next = vi.fn();
  });

  test('sets the app scope alias from the application context', async () => {
    await initializeScope(scope, next);

    const app = scope.app as unknown as Application;

    expect(app.scope).toBe(app.context);
  });

  test('adds setHeader to the response', async () => {
    await initializeScope(scope, next);

    scope.response.setHeader('Content-Type', 'application/json');

    expect(scope.set).toHaveBeenCalledWith('Content-Type', 'application/json');
  });

  test('returns the response from setHeader', async () => {
    await initializeScope(scope, next);

    const response = scope.response.setHeader('Content-Type', 'application/json');

    expect(response).toBe(scope.response);
  });

  test('adds withHeaders to the response', async () => {
    await initializeScope(scope, next);

    scope.response.withHeaders({
      'Content-Type': 'application/json',
      'X-Custom-Header': 'value',
    });

    expect(scope.set).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(scope.set).toHaveBeenCalledWith('X-Custom-Header', 'value');
  });

  test('returns the response from withHeaders', async () => {
    await initializeScope(scope, next);

    const response = scope.response.withHeaders({
      'Content-Type': 'application/json',
      'X-Custom-Header': 'value',
    });

    expect(response).toBe(scope.response);
  });

  test('calls next middleware', async () => {
    await initializeScope(scope, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
