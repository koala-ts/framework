import { loadRouteModuleDefinitions } from '@/routing/discovery/load-route-modules';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('Load route modules', () => {
  test('loads route definitions from explicit route modules and ignores non route exports', async () => {
    const routes = await loadRouteModuleDefinitions(['tests/fixtures/route-modules/mixed-exports.ts']);

    expect(routes).toEqual([
      {
        path: '/mixed-route',
        methods: ['get'],
        handler: expect.any(Function),
        parseBody: false,
        middleware: [],
        bodyOptions: {},
        source: path.resolve(process.cwd(), 'tests/fixtures/route-modules/mixed-exports.ts'),
      },
    ]);
  });
});
