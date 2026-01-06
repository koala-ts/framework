import { describe, expect, test } from 'vitest';
import { createPasswordHasher } from './password';

describe('createPasswordHasher', () => {
  test('hash and verify non password', async () => {
    const hasher = createPasswordHasher({ timeCost: 1, memoryCost: 1024 });

    const hashedPassword = await hasher.hash('mySecretPassword123');

    expect(await hasher.verify(hashedPassword, 'mySecretPassword123')).toBeTruthy();
    expect(await hasher.verify(hashedPassword, 'wrongPassword')).toBeFalsy();
  });

  test('it should detect needs rehash on changed config', async () => {
    const originalHasher = createPasswordHasher({ timeCost: 1, memoryCost: 1024 });
    const strongerHasher = createPasswordHasher({ timeCost: 2, memoryCost: 2048 });
    const hashedPassword = await originalHasher.hash('mySecretPassword123');

    expect(strongerHasher.needsRehash(hashedPassword)).toBeTruthy();
    expect(originalHasher.needsRehash(hashedPassword)).toBeFalsy();
  });

  test('verify on changed config still works', async () => {
    const originalHasher = createPasswordHasher({ timeCost: 1, memoryCost: 1024 });
    const modifiedHasher = createPasswordHasher({ timeCost: 2, memoryCost: 2048 });
    const hashedPassword = await originalHasher.hash('mySecretPassword123');

    expect(await modifiedHasher.verify(hashedPassword, 'mySecretPassword123')).toBeTruthy();
  });
});
