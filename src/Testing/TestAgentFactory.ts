import type { Request } from 'koa';
import supertest from 'supertest';
import { create } from '#koala/application/create-application';
import type { KoalaConfig } from '#koala/config/koala-config';
import type { HttpMiddleware, HttpScope, NextMiddleware } from '#koala/Http/index';
import type { User } from '#koala/Security/types';
import type { TestAgent } from '#koala/Testing/types';

export function createTestAgent<TRequest extends Request>(
  config: KoalaConfig<TRequest>,
  agentConfig?: { actAs?: User },
): TestAgent {
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
