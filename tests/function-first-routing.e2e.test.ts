import { koalaDefaultConfig } from '@/config/default-config';
import type { HttpMiddleware, HttpRequest, HttpScope, NextMiddleware, UploadedFile } from '@/Http';
import { Any, Get, Post, Route, RouteGroup } from '@/routing';
import { exclusiveRoutingModeError } from '@/routing/deprecated-decorator/verify-routing-mode';
import { createTestAgent } from '@/Testing';
import { text } from 'node:stream/consumers';
import { describe, expect, test } from 'vitest';

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
        async (scope: HttpScope, next: NextMiddleware) => {
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
            async (scope: HttpScope, next: NextMiddleware) => {
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

  test('it should register request typed handlers through named verb helpers', async () => {
    interface CreateSourceRequest extends HttpRequest {
      body: { name: string };
      params: { workspaceId: string };
    }
    const validateCreateSourceRequest: HttpMiddleware<CreateSourceRequest> = async (_scope, next) => {
      await next();
    };
    const createSourceHandler = async ({ request, response }: HttpScope<CreateSourceRequest>): Promise<void> => {
      response.body = {
        name: request.body.name,
        workspaceId: request.params.workspaceId,
      };
    };
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        Post<CreateSourceRequest>(
          '/workspaces/:workspaceId/sources',
          'create',
          validateCreateSourceRequest,
          createSourceHandler,
        ),
      ],
    });

    const response = await agent.post('/workspaces/framework/sources').send({ name: 'Koala' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: 'Koala',
      workspaceId: 'framework',
    });
  });

  test('it should apply middleware declared through a verb helper in order', async () => {
    const authMiddleware: HttpMiddleware = async (scope: HttpScope, next: NextMiddleware) => {
      scope.response.append('x-middleware-order', 'auth');
      await next();
    };
    const auditMiddleware: HttpMiddleware = async (scope: HttpScope, next: NextMiddleware) => {
      scope.response.append('x-middleware-order', 'audit');
      await next();
    };
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        Get('/users', authMiddleware, auditMiddleware, async (scope: HttpScope) => {
          scope.response.body = { ok: true };
        }),
      ],
    });

    const response = await agent.get('/users');

    expect(response.status).toBe(200);
    expect(response.headers['x-middleware-order']?.split(', ')).toEqual(['auth', 'audit']);
    expect(response.body).toEqual({ ok: true });
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

  test('it should dispatch grouped routes through the test agent', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        RouteGroup(
          {
            prefix: '/api',
          },
          () => [
            Get('/users', async (scope: HttpScope) => {
              scope.response.body = [{ id: 1 }];
            }),
          ],
        ),
      ],
    });

    const response = await agent.get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it should apply grouped middleware before route overlays and route middleware', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        RouteGroup(
          {
            prefix: '/api',
            middleware: [
              async (scope: HttpScope, next: NextMiddleware) => {
                scope.response.append('x-middleware-order', 'group');
                await next();
              },
            ],
            routeConfig: {
              create: {
                middleware: [
                  async (scope: HttpScope, next: NextMiddleware) => {
                    scope.response.append('x-middleware-order', 'overlay');
                    await next();
                  },
                ],
                options: {},
              },
            },
          },
          () => [
            Route({
              name: 'create',
              method: 'POST',
              path: '/posts',
              middleware: [
                async (scope: HttpScope, next: NextMiddleware) => {
                  scope.response.append('x-middleware-order', 'route');
                  await next();
                },
              ],
              handler: async (scope: HttpScope) => {
                scope.response.body = { ok: true };
              },
            }),
          ],
        ),
      ],
    });

    const response = await agent.post('/api/posts');
    const middlewareOrder = response.headers['x-middleware-order']?.split(', ');

    expect(middlewareOrder).toEqual(['group', 'overlay', 'route']);
    expect(response.body).toEqual({ ok: true });
  });

  test('it should apply grouped route config to named helper routes', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        RouteGroup(
          {
            routeConfig: {
              upload: {
                options: {
                  multipart: true,
                },
                middleware: [],
              },
            },
          },
          () => [
            Post('/upload-avatar', 'upload', async (scope: HttpScope) => {
              const request = scope.request as FunctionFirstRoutingRequest;

              scope.response.body = {
                uploadedFileName: request.files.avatar.originalFilename,
              };
            }),
          ],
        ),
      ],
    });

    const response = await agent.post('/upload-avatar').attach('avatar', 'tests/fixtures/avatar.png');

    expect(response.body).toEqual({
      uploadedFileName: 'avatar.png',
    });
  });

  test('it should compose nested route groups through the test agent', async () => {
    const agent = createTestAgent({
      ...koalaDefaultConfig,
      routes: [
        RouteGroup(
          {
            prefix: '/api',
            namePrefix: 'api.',
          },
          () => [
            RouteGroup(
              {
                prefix: '/posts',
                namePrefix: 'posts.',
              },
              () => [
                Get('/', 'list', async (scope: HttpScope) => {
                  scope.response.body = [{ id: 1 }];
                }),
              ],
            ),
          ],
        ),
      ],
    });

    const response = await agent.get('/api/posts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1 }]);
  });

  test('it should reject duplicate grouped route signatures after flattening', () => {
    expect(() =>
      createTestAgent({
        ...koalaDefaultConfig,
        routes: [
          RouteGroup(
            {
              prefix: '/api',
            },
            () => [Get('/users', async () => undefined)],
          ),
          RouteGroup(
            {
              prefix: '/api',
            },
            () => [Get('/users', async () => undefined)],
          ),
        ],
      }),
    ).toThrow('Duplicate route signature detected: GET /api/users.');
  });

  test('it should reject duplicate grouped route names after flattening', () => {
    expect(() =>
      createTestAgent({
        ...koalaDefaultConfig,
        routes: [
          RouteGroup(
            {
              prefix: '/api',
              namePrefix: 'api.',
            },
            () => [Get('/users', 'users.list', async () => undefined)],
          ),
          RouteGroup(
            {
              prefix: '/admins',
              namePrefix: 'api.',
            },
            () => [Get('/users', 'users.list', async () => undefined)],
          ),
        ],
      }),
    ).toThrow('Duplicate route name detected: api.users.list.');
  });
});
