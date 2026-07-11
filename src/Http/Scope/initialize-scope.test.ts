import type { Next } from 'koa';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { HttpScope } from '#koala/Http/index';
import { initializeScope, type ScopeAwareApp } from '#koala/Http/Scope/initialize-scope';

describe('initializeScope', () => {
  let scope: HttpScope;
  let next: Next;

  beforeEach(() => {
    scope = { app: { context: {} } as ScopeAwareApp, response: {}, set: vi.fn() } as unknown as HttpScope;
    scope.response.ctx = scope;
    next = vi.fn();
  });

  test('sets the app scope alias from the application context', async () => {
    await initializeScope(scope, next);

    const app = scope.app as unknown as ScopeAwareApp;

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

  test('does not replace response helpers when called twice', async () => {
    await initializeScope(scope, next);

    const setHeader = scope.response.setHeader;
    const withHeaders = scope.response.withHeaders;

    await initializeScope(scope, next);

    expect(scope.response.setHeader).toBe(setHeader);
    expect(scope.response.withHeaders).toBe(withHeaders);
  });

  test('does not replace the app scope alias when already initialized', async () => {
    await initializeScope(scope, next);

    const app = scope.app as unknown as ScopeAwareApp;
    const currentScope = app.scope;

    await initializeScope(scope, next);

    expect(app.scope).toBe(currentScope);
  });

  test('calls next middleware', async () => {
    await initializeScope(scope, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
