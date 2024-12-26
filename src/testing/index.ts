import { IKoalaConfig } from '../config/types';
import { create } from '../core/application';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

export function testAgent(config: IKoalaConfig): TestAgent {
    return supertest(create(config).callback());
}
