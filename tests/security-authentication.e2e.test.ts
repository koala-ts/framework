import { describe, expect, test, vi } from 'vitest';
import { createTestAgent, type HttpScope, Route } from '../src';
import { firewall } from '../src/Security/firewall/firewall-middleware';

class MyController {
  @Route({ path: '/public', method: 'get' })
  publicResource(scope: HttpScope): void {
    scope.response.body = 'Hello, World!';
  }

  @Route({ path: '/api/v1/protected', method: 'get' })
  protectedResource(scope: HttpScope): void {
    scope.response.body = 'Protected Resource';
  }
}

const userProvider = vi.fn();
const securityConfig = {
  firewalls: [
    {
      pattern: '^/public',
      security: false,
    },
    {
      pattern: '^/api',
      security: true,
    },
    {
      pattern: '^/protected/with/provider',
      security: true,
      provider: userProvider,
    },
  ],
};

describe('Security Authentication E2E Tests', () => {
  test('Firewall should block access to protected route', async () => {
    const config = {
      controllers: [MyController],
      globalMiddleware: [firewall(securityConfig)],
    };
    const agent = createTestAgent(config);

    const response = await agent.get('/api/v1/protected');

    expect(response.status).toBe(401);
    expect(response.text).toBe('Authentication required');
  });

  test('Firewall should allow only authenticated users to access protected route', async () => {
    const config = {
      controllers: [MyController],
      globalMiddleware: [firewall(securityConfig)],
    };
    const MyUser = { identifier: 'user-1' };
    const agent = createTestAgent(config, { actAs: MyUser });

    const response = await agent.get('/api/v1/protected');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Protected Resource');
  });

  test('Firewall should allow access to unprotected route', async () => {
    const config = {
      controllers: [MyController],
      globalMiddleware: [firewall(securityConfig)],
    };
    const agent = createTestAgent(config);

    const response = await agent.get('/public');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });

  test('Firewall should depend on specified user provider for authentication', async () => {
    userProvider.mockResolvedValue({ identifier: 'provided-user' });
    const config = {
      controllers: [MyController],
      globalMiddleware: [firewall(securityConfig)],
    };
    const agent = createTestAgent(config);

    await agent.get('/protected/with/provider');

    expect(userProvider).toHaveBeenCalled();
  });

  test('Firewall should bypass routes without firewall', async () => {
    const config = {
      controllers: [MyController],
      globalMiddleware: [firewall(securityConfig)],
    };
    const agent = createTestAgent(config);

    const response = await agent.get('/no/firewall/here');

    expect(response.status).toBe(404);
  });
});
