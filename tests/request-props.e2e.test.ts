import { describe, expect, test } from 'vitest';
import { createTestAgent, type HttpRequest, type HttpScope, Route, UploadedFile } from '../src';

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
});
