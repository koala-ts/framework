import { text } from 'node:stream/consumers';
import path from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { createTestAgent, type HttpRequest, type HttpScope, Route, type KoalaConfig, type UploadedFile } from '../src';

interface DecoratorRoutingRequest extends HttpRequest {
  body: { name: string };
  files: {
    avatar: UploadedFile;
  };
}

class DecoratorRoutingController {
  @Route({ method: 'post', path: '/decorator-route', options: { parseBody: false } })
  create(scope: HttpScope): void {
    scope.response.body = { ok: true };
  }

  @Route({ method: 'get', path: '/decorator-route' })
  list(scope: HttpScope): void {
    scope.response.status = 204;
  }

  @Route({ method: ['get', 'post'], path: '/decorator-route-with-multiple-methods' })
  multipleMethods(scope: HttpScope): void {
    scope.response.body = { method: scope.request.method };
  }

  @Route({ method: 'ANY', path: '/decorator-route-any' })
  anyMethod(scope: HttpScope): void {
    scope.response.body = { method: scope.request.method };
  }

  @Route({ method: 'all', path: '/decorator-route-all' })
  allMethods(scope: HttpScope): void {
    scope.response.body = { method: scope.request.method };
  }

  @Route({
    method: 'get',
    path: '/decorator-route-with-middleware',
    middleware: [
      async (scope, next) => {
        scope.response.set('x-route-middleware', 'applied');
        await next();
      },
    ],
  })
  routeMiddleware(scope: HttpScope): void {
    scope.response.body = { ok: true };
  }

  @Route({ method: 'post', path: '/decorator-upload', options: { multipart: true } })
  upload(scope: HttpScope<DecoratorRoutingRequest>): void {
    scope.response.body = {
      uploadedFileName: scope.request.files.avatar.originalFilename,
    };
  }

  @Route({ method: 'post', path: '/decorator-raw-body', options: { parseBody: false } })
  async rawBody(scope: HttpScope): Promise<void> {
    const body = await text(scope.request.req);

    scope.response.body = { body };
  }
}

describe('Decorator Routing E2E Test', () => {
  test('it should apply global middleware to decorated routes', async () => {
    const middleware = vi.fn(async (_scope: HttpScope, next: () => Promise<void>) => {
      await next();
    });
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
      globalMiddleware: [middleware],
    } as KoalaConfig);

    await agent.post('/decorator-route');

    expect(middleware).toHaveBeenCalled();
  });

  test('it should dispatch decorated routes', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const response = await agent.post('/decorator-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  test('it should dispatch decorated routes for multiple methods', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const getResponse = await agent.get('/decorator-route-with-multiple-methods');
    const postResponse = await agent.post('/decorator-route-with-multiple-methods');

    expect(getResponse.body).toEqual({ method: 'GET' });
    expect(postResponse.body).toEqual({ method: 'POST' });
  });

  test('it should dispatch decorated routes declared with any', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const patchResponse = await agent.patch('/decorator-route-any');
    const deleteResponse = await agent.delete('/decorator-route-any');

    expect(patchResponse.body).toEqual({ method: 'PATCH' });
    expect(deleteResponse.body).toEqual({ method: 'DELETE' });
  });

  test('it should dispatch decorated routes declared with all', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const putResponse = await agent.put('/decorator-route-all');
    const optionsResponse = await agent.options('/decorator-route-all');

    expect(putResponse.body).toEqual({ method: 'PUT' });
    expect(optionsResponse.body).toEqual({ method: 'OPTIONS' });
  });

  test('it should apply route middleware to decorated routes', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const response = await agent.get('/decorator-route-with-middleware');

    expect(response.status).toBe(200);
    expect(response.headers['x-route-middleware']).toBe('applied');
    expect(response.body).toEqual({ ok: true });
  });

  test('it should dispatch function-first route modules', async () => {
    const agent = createTestAgent({
      routing: { routeModules: ['tests/fixtures/route-modules/function-route.ts'] },
    } as KoalaConfig);

    const response = await agent.get('/decorator-function-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'function' });
  });

  test('it should discover function-first route modules from routesDir', async () => {
    const agent = createTestAgent({
      routing: { routesDir: path.resolve(process.cwd(), 'tests/fixtures/route-modules/discovered-routes') },
    } as KoalaConfig);

    const response = await agent.get('/discovered-function-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'routesDir' });
  });

  test('it should dispatch function-first route modules declared with get sugar', async () => {
    const agent = createTestAgent({
      routing: { routeModules: ['tests/fixtures/route-modules/get-route.ts'] },
    } as KoalaConfig);

    const response = await agent.get('/get-sugar-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'get-sugar' });
  });

  test('it should dispatch function-first route modules declared through a route manifest', async () => {
    const agent = createTestAgent({
      routing: { routeManifest: 'tests/fixtures/route-modules/generated-route-manifest.ts' },
    } as KoalaConfig);

    const response = await agent.get('/decorator-function-route');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, source: 'function' });
  });

  test('it should fail fast when route modules register duplicate routes', () => {
    const createAgent = (): ReturnType<typeof createTestAgent> =>
      createTestAgent({
        routing: {
          routeModules: ['tests/fixtures/route-modules/duplicate-a.ts', 'tests/fixtures/route-modules/duplicate-b.ts'],
        },
      } as KoalaConfig);

    expect(createAgent).toThrow('Duplicate route detected for GET /duplicate-route');
  });

  test('it should respond with allowed methods for decorated routes', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const response = await agent.delete('/decorator-route');
    const allowedMethods = response.headers.allow.split(', ').sort();

    expect(response.status).toBe(405);
    expect(allowedMethods).toEqual(['GET', 'HEAD', 'POST']);
  });

  test('it should parse multipart bodies for decorated routes', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);

    const response = await agent.post('/decorator-upload').attach('avatar', 'tests/fixtures/avatar.png');

    expect(response.body).toEqual({
      uploadedFileName: 'avatar.png',
    });
  });

  test('it should skip body parsing when parseBody is false on decorated routes', async () => {
    const agent = createTestAgent({
      controllers: [DecoratorRoutingController],
    } as KoalaConfig);
    const body = 'raw decorator body';

    const response = await agent.post('/decorator-raw-body').set('Content-Type', 'text/plain').send(body);

    expect(response.body).toEqual({ body });
  });
});
