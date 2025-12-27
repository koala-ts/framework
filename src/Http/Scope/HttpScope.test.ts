import type { Request } from 'koa';
import { describe, expect, it } from 'vitest';
import type { HttpMiddleware, HttpScope } from './types';

describe('HttpScope with custom request type', (): void => {
  it('should allow custom request type without extending HttpRequest', (): void => {
    interface CustomRequest extends Request {
      customProperty: string;
      userId: number;
    }

    const middleware: HttpMiddleware<CustomRequest> = async (scope, next): Promise<void> => {
      expect(scope.request.customProperty).toBeDefined();
      expect(scope.request.userId).toBeDefined();
      await next();
    };

    expect(middleware).toBeDefined();
  });

  it('should work with default HttpRequest when no generic is specified', (): void => {
    const middleware: HttpMiddleware = async (scope, next): Promise<void> => {
      expect(scope.request.body).toBeDefined();
      expect(scope.request.params).toBeDefined();
      expect(scope.request.files).toBeDefined();
      await next();
    };

    expect(middleware).toBeDefined();
  });

  it('should support HttpScope with custom request directly', (): void => {
    interface AuthenticatedRequest extends Request {
      user: { id: number; email: string };
      token: string;
    }

    type AuthenticatedScope = HttpScope<AuthenticatedRequest>;

    const handler = (scope: AuthenticatedScope): void => {
      expect(scope.request.user).toBeDefined();
      expect(scope.request.token).toBeDefined();
    };

    expect(handler).toBeDefined();
  });
});
