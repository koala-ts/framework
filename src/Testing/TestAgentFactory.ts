import supertest from 'supertest';
import { type TestAgent } from './types';
import { create } from '@/Application';
import { type KoalaConfig } from '@/Config';

export function createTestAgent(config: KoalaConfig): TestAgent {
  return supertest(create(config).callback());
}
