import { create } from '@/application/create-application';
import type { Application } from '@/application/application';
import { type KoalaConfig } from '@/Config';
import { type HttpMiddleware, type HttpScope, type NextMiddleware } from '@/Http';
import { type User } from '@/Security/types';
import supertest from 'supertest';
import { type TestAgent } from './types';

export function createTestAgent(config: KoalaConfig, agentConfig?: { actAs?: User }): TestAgent {
  return createTestAgentFromApp(create(createTestConfig(config, agentConfig)));
}

export function createTestAgentFromApp(app: Application, agentConfig?: { actAs?: User }): TestAgent {
  const { actAs } = agentConfig ?? {};

  if (actAs !== undefined) {
    app.middleware.unshift(actAsUser(actAs));
  }

  return supertest(app.callback());
}

function createTestConfig(config: KoalaConfig, agentConfig?: { actAs?: User }): KoalaConfig {
  const globalMiddleware = config.globalMiddleware ?? [];
  const testConfig = { ...config };

  const { actAs } = agentConfig ?? {};

  if (undefined !== actAs) {
    testConfig.globalMiddleware = [actAsUser(actAs), ...globalMiddleware];
  }

  return testConfig;
}

function actAsUser(user: User): HttpMiddleware {
  return async function actAsUserMiddleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
    scope.user = user;
    await next();
  };
}
