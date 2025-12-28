import { describe, expect, test } from 'vitest';
import { createTestAgent, type HttpScope, Route } from '../src';

class MyController {
  @Route({ method: 'GET', path: '/response-basics' })
  responseBasics(scope: HttpScope): void {
    scope.response.set('Custom-Header', 'HeaderValue');
    scope.response.body = { message: 'Response Basics' };
    scope.response.status = 200;
  }
}

describe('Generate Response E2E Test', () => {
  test('response basics', async () => {
    const agent = createTestAgent({ controllers: [MyController] });

    const response = await agent.get('/response-basics');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Response Basics' });
    expect(response.headers['custom-header']).toBe('HeaderValue');
  });
});
