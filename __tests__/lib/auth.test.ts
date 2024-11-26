import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createToken, verifyToken, getUser } from '@/lib/auth';
import { cookies } from 'next/headers';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn((key) => key === 'token' ? { value: 'test-token' } : null),
  })),
}));

describe('auth', () => {
  const testPayload = { userId: '123', role: 'user' };
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, JWT_SECRET: 'test-secret-key-must-be-at-least-32-characters' };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe('createToken', () => {
    it('creates a valid JWT token', async () => {
      const token = await createToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('handles errors gracefully', async () => {
      const invalidPayload = { circular: {} };
      invalidPayload.circular.self = invalidPayload;
      await expect(createToken(invalidPayload)).rejects.toThrow();
    });
  });

  describe('verifyToken', () => {
    it('returns null for invalid token', async () => {
      const verified = await verifyToken('invalid-token');
      expect(verified).toBeNull();
    });
  });

  describe('getUser', () => {
    it('returns null when no token cookie exists', async () => {
      vi.mocked(cookies).mockImplementationOnce(() => ({
        get: vi.fn(() => null),
      }));
      const user = await getUser();
      expect(user).toBeNull();
    });

    it('returns null when token is invalid', async () => {
      vi.mocked(cookies).mockImplementationOnce(() => ({
        get: vi.fn(() => ({ value: 'invalid-token' })),
      }));
      const user = await getUser();
      expect(user).toBeNull();
    });
  });
});