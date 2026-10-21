import { hash, verify } from '@node-rs/argon2';

const OPTS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try { return await verify(passwordHash, password); }
  catch { return false; }
}

export const DUMMY_HASH_PROMISE = hashPassword('never-matched-' + Math.random());