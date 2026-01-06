import { hash as _hash, needsRehash as _needsRehash, verify as _verify } from 'argon2';
import { type PasswordConfig, type PasswordHasher } from '@/Security/password/types';

function hash(config?: PasswordConfig): PasswordHasher['hash'] {
  return function (plainPassword: string): Promise<string> {
    return _hash(plainPassword, config);
  };
}

function verify(config?: PasswordConfig): PasswordHasher['verify'] {
  return function (hashedPassword: string, plainPassword: string): Promise<boolean> {
    return _verify(hashedPassword, plainPassword, config);
  };
}

function needsRehash(config?: PasswordConfig): PasswordHasher['needsRehash'] {
  return function (hashedPassword: string): boolean {
    return _needsRehash(hashedPassword, config);
  };
}

export function createPasswordHasher(config?: PasswordConfig): PasswordHasher {
  return {
    hash: hash(config),
    verify: verify(config),
    needsRehash: needsRehash(config),
  };
}
