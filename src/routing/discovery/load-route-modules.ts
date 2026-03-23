import type { RouteModule } from '@/Config';
import { getRouteDefinitionsFromHandler, hasAttachedRouteMetadata } from '@/routing/decorator/decorated-route';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';
import { createJiti } from 'jiti';
import * as path from 'node:path';

const importRouteModule = createJiti(import.meta.url, {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
  interopDefault: false,
  moduleCache: true,
});

export async function loadRouteModuleDefinitions(routeModules: RouteModule[]): Promise<RouteMetadata[]> {
  const routes: RouteMetadata[] = [];

  for (const routeModule of routeModules) {
    const modulePath = resolveModulePath(routeModule);
    const exports = (await importRouteModule.import(modulePath)) as Record<string, unknown>;

    routes.push(...extractRouteModuleDefinitions(exports, modulePath));
  }

  return routes;
}

function extractRouteModuleDefinitions(exports: Record<string, unknown>, source: string): RouteMetadata[] {
  const routes: RouteMetadata[] = [];

  for (const exportedValue of Object.values(exports)) {
    if (!hasAttachedRouteMetadata(exportedValue)) {
      continue;
    }

    routes.push(...getRouteDefinitionsFromHandler(exportedValue, source));
  }

  return routes;
}

function resolveModulePath(modulePath: string, baseDirectory: string = process.cwd()): string {
  return path.isAbsolute(modulePath) ? modulePath : path.resolve(baseDirectory, modulePath);
}
