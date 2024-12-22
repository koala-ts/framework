import { expect, test } from 'vitest'
import { main } from '../src/index.js';

const message = await main();

test('Example', ()=> {
    expect(message).toBe('Howdy, Koala! 🐨');
});
