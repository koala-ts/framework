import { describe, expect, it } from 'vitest';
import { type Metadata } from '@/serializer';
import { createNormalizer } from '@/serializer/normalizer/normalizer';

describe('Normalizer', () => {
  it('should normalize plain objects with context', () => {
    const input = { id: 1, username: 'admin', c: true, age: undefined, roles: ['admin', 'user'] };
    const normalize = createNormalizer();

    const result = normalize(input, { metadata: { id: { ignore: true } } });

    const expected = { username: 'admin', c: true, age: null, roles: ['admin', 'user'] };
    expect(result).toEqual(expected);
  });

  it('should allow adding custom normalizers', () => {
    const input = { id: 1, createdAt: new Date('2024-01-01T00:00:00Z') };
    const customDateNormalizer = function (value: unknown): string | undefined {
      if (value instanceof Date) return value.toISOString();
      return undefined;
    };
    const normalize = createNormalizer([customDateNormalizer]);

    const result = normalize(input);

    const expected = { id: 1, createdAt: '2024-01-01T00:00:00.000Z' };
    expect(result).toEqual(expected);
  });

  it('should handle nested metadata', () => {
    const normalize = createNormalizer();
    const input = {
      user: { id: 'u1', name: 'John', title: 'Developer' },
      post: { id: 'p1', title: 'Hello world!' },
    };
    const metadata: Metadata = {
      user: {
        groups: ['post:read'],
        metadata: {
          id: { groups: ['post:read'] },
          name: { groups: ['post:read'] },
          title: { groups: ['admin'] },
        },
      },
      post: {
        groups: ['post:read'],
        metadata: {
          id: { groups: ['post:read'] },
          title: { groups: ['post:read'] },
        },
      },
    };

    const result = normalize(input, { metadata, groups: ['post:read'] });

    expect(result).toEqual({
      user: { id: 'u1', name: 'John' },
      post: { id: 'p1', title: 'Hello world!' },
    });
  });

  it('should handle nested metadata with arrays', () => {
    const normalize = createNormalizer();
    const input = {
      user: { id: 'u1', name: 'John' },
      posts: [
        { id: 'p1', title: 'Hello world!' },
        { id: 'p2', title: 'Another post' },
      ],
    };
    const metadata: Metadata = {
      user: {
        groups: ['post:delete'],
        metadata: {
          id: { groups: ['post:read'] },
          name: { groups: ['post:read'] },
        },
      },
      posts: {
        groups: ['post:delete'],
        metadata: {
          id: { groups: ['post:delete'] },
          title: { groups: ['post:read'] },
        },
      },
    };
    const result = normalize(input, { metadata, groups: ['post:delete'] });

    expect(result).toEqual({
      user: {},
      posts: [{ id: 'p1' }, { id: 'p2' }],
    });
  });
});
