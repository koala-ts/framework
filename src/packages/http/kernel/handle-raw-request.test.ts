import { describe, expect, it, vi } from 'vitest';
import type { HttpResponse } from '#http/foundation/http-response';
import { type Controller, handleRawRequest, type RawRequest } from '#http/kernel/handle-raw-request';

describe('Handle raw request', () => {
  it('invokes the controller with http request', async () => {
    const response: HttpResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: 'Hello, world!',
    };

    const rawRequest: RawRequest = {
      message: new Request('https://koala.test.user/123'),
      context: { params: { userId: '123' } },
      controller: vi.fn<Controller>().mockResolvedValue(response),
    };

    const result = await handleRawRequest(rawRequest);

    expect(rawRequest.controller).toHaveBeenCalledWith({
      message: rawRequest.message,
      params: rawRequest.context.params,
    });
    expect(result).toEqual(response);
  });
});
