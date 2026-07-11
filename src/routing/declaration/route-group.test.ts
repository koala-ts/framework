import { describe, expect, test } from 'vitest';
import { Get } from '#koala/routing/declaration/http-verb-helpers';
import { RouteGroup } from '#koala/routing/declaration/route-group';

describe('route group', () => {
  test('it creates a callback-based route group definition', () => {
    const group = RouteGroup(
      {
        prefix: '/api',
        namePrefix: 'api.',
      },
      () => [Get('/users', 'users.list', async () => undefined)],
    );

    expect(group.kind).toBe('route-group');
    expect(group.options).toEqual({
      prefix: '/api',
      namePrefix: 'api.',
    });
    expect(group.resolveRoutes()).toHaveLength(1);
  });

  test('it keeps route overlays on the group definition', () => {
    const group = RouteGroup(
      {
        routeConfig: {
          create: {
            options: { parseBody: false },
          },
        },
      },
      () => [],
    );

    expect(group.options.routeConfig).toEqual({
      create: {
        options: { parseBody: false },
      },
    });
  });
});
