export interface PasswordConfig {
  hashLength?: number;
  timeCost?: number;
  memoryCost?: number;
  parallelism?: number;
  secret?: Buffer;
  associatedData?: Buffer;
}

export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;

  verify(hashedPassword: string, plainPassword: string): Promise<boolean>;

  needsRehash(hashedPassword: string): boolean;
}
