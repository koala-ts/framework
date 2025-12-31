import supertest from 'supertest';
import { type TestAgent } from './types';
import { create } from '@/Application';
import { type KoalaConfig } from '@/Config';
import { type HttpMiddleware, type HttpScope, type NextMiddleware } from '@/Http';
import { type User } from '@/Security/types';

export function createTestAgent(config: KoalaConfig, agentConfig?: { actAs?: User }): TestAgent {
  const globalMiddleware = config.globalMiddleware ?? [];
  const testConfig = { ...config };

  const { actAs } = agentConfig ?? {};

  if (undefined !== actAs) {
    testConfig.globalMiddleware = [actAsUser(actAs), ...globalMiddleware];
  }

  return supertest(create(testConfig).callback());
}

function actAsUser(user: User): HttpMiddleware {
  return async function actAsUserMiddleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
    scope.user = user;
    await next();
  };
}
