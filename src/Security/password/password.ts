import { hash as _hash, needsRehash as _needsRehash, verify as _verify } from 'argon2';
import type { PasswordConfig, PasswordHasher } from '@/Security/password/types';

function hash(config?: PasswordConfig): PasswordHasher['hash'] {
  return (plainPassword: string): Promise<string> => _hash(plainPassword, config);
}

function verify(config?: PasswordConfig): PasswordHasher['verify'] {
  return (hashedPassword: string, plainPassword: string): Promise<boolean> =>
    _verify(hashedPassword, plainPassword, config);
}

function needsRehash(config?: PasswordConfig): PasswordHasher['needsRehash'] {
  return (hashedPassword: string): boolean => _needsRehash(hashedPassword, config);
}

export function createPasswordHasher(config?: PasswordConfig): PasswordHasher {
  return {
    hash: hash(config),
    verify: verify(config),
    needsRehash: needsRehash(config),
  };
}
