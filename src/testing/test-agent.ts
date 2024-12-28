import { IKoalaConfig } from '../config';
import supertest from 'supertest';
import { create } from '../core';
import { ITestAgent } from './types';

export function testAgent(config: IKoalaConfig): ITestAgent {
    return supertest(create(config).callback());
}
