import { text } from 'node:stream/consumers';
import { describe, expect, test } from 'vitest';
import { createTestAgent, type HttpRequest, type HttpScope, Route, type UploadedFile } from '../src/index.js';

interface MyRequest extends HttpRequest {
  body: { name: string };
  params: { id: string };
  headers: { foo: string };
  files: {
    avatar: UploadedFile;
  };
}

class MyController {
  @Route({ method: 'POST', path: '/my-action/:id' })
  myAction(scope: HttpScope<MyRequest>): void {
    scope.response.body = {
      greeting: `Hello, ${scope.request.body.name}!`,
      sentId: scope.request.params.id,
      barHeader: scope.request.headers.foo,
    };
  }

  @Route({ method: 'POST', path: '/upload-avatar', options: { multipart: true } })
  multipartUpload(scope: HttpScope<MyRequest>): void {
    scope.response.body = {
      uploadedFileName: scope.request.files.avatar.originalFilename,
    };
  }

  @Route({ method: 'POST', path: '/non-parsed-body', options: { parseBody: false } })
  async nonParsedBody(scope: HttpScope<MyRequest>): Promise<void> {
    const rawBody = await text(scope.request.req);
    scope.response.body = { rawBody };
  }
}

describe('Request Properties E2E Test', () => {
  test('access request props', async () => {
    const agent = createTestAgent({ controllers: [MyController] });

    const response = await agent.post('/my-action/13').send({ name: 'Koala' }).set('foo', 'bar');

    expect(response.body).toEqual({
      greeting: 'Hello, Koala!',
      sentId: '13',
      barHeader: 'bar',
    });
  });

  test('access uploaded files', async () => {
    const agent = createTestAgent({ controllers: [MyController] });

    const response = await agent.post('/upload-avatar').attach('avatar', 'tests/fixtures/avatar.png');

    expect(response.body).toEqual({
      uploadedFileName: 'avatar.png',
    });
  });

  test('non-parsed body', async () => {
    const agent = createTestAgent({ controllers: [MyController] });
    const rawBody = 'raw body content';

    const response = await agent.post('/non-parsed-body').set('Content-Type', 'text/plain').send(rawBody);

    expect(response.body).toEqual({
      rawBody,
    });
  });
});
