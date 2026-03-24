import { text } from 'node:stream/consumers';
import { describe, expect, test } from 'vitest';
import { createTestAgent, type HttpRequest, type HttpScope, type UploadedFile } from '../src';
import { koalaDefaultConfig } from '../src/Config';
import { Any, Get, Route } from '../src/routing';
import { exclusiveRoutingModeError } from '../src/routing/verify-routing-mode';

interface FunctionFirstRoutingRequest extends HttpRequest {
  body: { name: string };
  files: {
    avatar: UploadedFile;
  };
}

describe('Function First Routing E2E Test', () => {
  test('it should dispatch explicit routes through the test agent', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: 'GET',
          path: '/users',
          handler: async (scope: HttpScope) => {
            scope.response.body = [{ id: 1 }];
          },
        }),
      ],
    });

    const response = await agent.get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it should apply global middleware to explicit routes through the test agent', async () => {
    const agent = createTestAgent({
      controllers: [],
      globalMiddleware: [
        async (scope, next) => {
          scope.response.set('x-global-middleware', 'applied');
          await next();
        },
      ],
      routes: [
        Route({
          method: 'GET',
          path: '/users',
          handler: async (scope: HttpScope) => {
            scope.response.body = [];
          },
        }),
      ],
    });

    const response = await agent.get('/users');

    expect(response.headers['x-global-middleware']).toBe('applied');
    expect(response.body).toEqual([]);
  });

  test('it should dispatch explicit routes for multiple methods', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: ['GET', 'POST'],
          path: '/users',
          handler: async (scope: HttpScope) => {
            scope.response.body = { method: scope.request.method };
          },
        }),
      ],
    });

    const getResponse = await agent.get('/users');
    const postResponse = await agent.post('/users');

    expect(getResponse.body).toEqual({ method: 'GET' });
    expect(postResponse.body).toEqual({ method: 'POST' });
  });

  test('it should dispatch explicit routes declared with any', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: 'ANY',
          path: '/users',
          handler: async (scope: HttpScope) => {
            scope.response.body = { method: scope.request.method };
          },
        }),
      ],
    });

    const patchResponse = await agent.patch('/users');
    const deleteResponse = await agent.delete('/users');

    expect(patchResponse.body).toEqual({ method: 'PATCH' });
    expect(deleteResponse.body).toEqual({ method: 'DELETE' });
  });

  test('it should apply route middleware to explicit routes', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: 'GET',
          path: '/users',
          middleware: [
            async (scope, next) => {
              scope.response.set('x-route-middleware', 'applied');
              await next();
            },
          ],
          handler: async (scope: HttpScope) => {
            scope.response.body = { ok: true };
          },
        }),
      ],
    });

    const response = await agent.get('/users');

    expect(response.headers['x-route-middleware']).toBe('applied');
    expect(response.body).toEqual({ ok: true });
  });

  test('it should respond with allowed methods for explicit routes', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: 'GET',
          path: '/users',
          handler: async (scope: HttpScope) => {
            scope.response.body = [];
          },
        }),
      ],
    });

    const response = await agent.delete('/users');

    expect(response.status).toBe(405);
    expect(response.headers.allow).toBeDefined();

    const allowedMethods = response.headers.allow?.split(', ').sort();

    expect(allowedMethods).toEqual(['GET', 'HEAD']);
  });

  test('it should parse multipart bodies for explicit routes', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: 'POST',
          path: '/upload-avatar',
          options: { multipart: true },
          handler: async (scope: HttpScope) => {
            const request = scope.request as FunctionFirstRoutingRequest;

            scope.response.body = {
              uploadedFileName: request.files.avatar.originalFilename,
            };
          },
        }),
      ],
    });

    const response = await agent.post('/upload-avatar').attach('avatar', 'tests/fixtures/avatar.png');

    expect(response.body).toEqual({
      uploadedFileName: 'avatar.png',
    });
  });

  test('it should skip body parsing when parseBody is false on explicit routes', async () => {
    const agent = createTestAgent({
      controllers: [],
      routes: [
        Route({
          method: 'POST',
          path: '/raw-body',
          options: { parseBody: false },
          handler: async (scope: HttpScope) => {
            const body = await text(scope.request.req);

            scope.response.body = { body };
          },
        }),
      ],
    });
    const body = 'raw function-first body';

    const response = await agent.post('/raw-body').set('Content-Type', 'text/plain').send(body);

    expect(response.body).toEqual({ body });
  });

  test('it should reject mixing legacy controllers and explicit routes through the test agent', () => {
    class LegacyController {}

    expect(() =>
      createTestAgent({
        controllers: [LegacyController],
        routes: [
          Route({
            method: 'GET',
            path: '/users',
            handler: async (scope: HttpScope) => {
              scope.response.body = [];
            },
          }),
        ],
      }),
    ).toThrow(exclusiveRoutingModeError);
  });

  test('it should dispatch routes declared with a verb helper', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        Get('/users', async (scope: HttpScope) => {
          scope.response.body = [{ id: 1 }];
        }),
      ],
    });

    const response = await agent.get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it should keep the route name when using a named verb helper', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        Get('/users', 'users.list', async (scope: HttpScope) => {
          scope.response.body = [{ id: 1 }];
        }),
      ],
    });

    const response = await agent.get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it should dispatch routes declared with the any helper', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        Any('/users', async (scope: HttpScope) => {
          scope.response.body = { method: scope.request.method };
        }),
      ],
    });

    const patchResponse = await agent.patch('/users');
    const deleteResponse = await agent.delete('/users');

    expect(patchResponse.body).toEqual({ method: 'PATCH' });
    expect(deleteResponse.body).toEqual({ method: 'DELETE' });
  });

  test('it should reject duplicate route signatures through the test agent', () => {
    expect(() =>
      createTestAgent({
        ...koalaDefaultConfig,
        routes: [
          Route({
            method: 'GET',
            path: '/users',
            handler: async (scope: HttpScope) => {
              scope.response.body = [{ id: 1 }];
            },
          }),
          Route({
            method: 'GET',
            path: '/users',
            handler: async (scope: HttpScope) => {
              scope.response.body = [{ id: 2 }];
            },
          }),
        ],
      }),
    ).toThrow('Duplicate route signature detected: GET /users.');
  });

  test('it should reject duplicate route names through the test agent', () => {
    expect(() =>
      createTestAgent({
        ...koalaDefaultConfig,
        routes: [
          Get('/users', 'users.list', async (scope: HttpScope) => {
            scope.response.body = [{ id: 1 }];
          }),
          Get('/admins', 'users.list', async (scope: HttpScope) => {
            scope.response.body = [{ id: 2 }];
          }),
        ],
      }),
    ).toThrow('Duplicate route name detected: users.list.');
  });
});
