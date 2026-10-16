import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@vexro/shared';

describe('registerSchema', () => {
  it('accepts a valid payload and normalizes email', () => {
    const result = registerSchema.safeParse({
      email: 'Test@Example.com',
      username: 'vexro_dev',
      password: 'SuperSecret123',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('test@example.com');
  });

  it('rejects weak passwords', () => {
    expect(registerSchema.safeParse({ email: 'a@b.com', username: 'user', password: 'weak' }).success).toBe(false);
  });

  it('rejects bad usernames', () => {
    expect(registerSchema.safeParse({ email: 'a@b.com', username: 'bad user!', password: 'SuperSecret123' }).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('requires a password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });
});