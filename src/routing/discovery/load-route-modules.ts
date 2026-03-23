import type { RouteManifest, RouteModule } from '@/Config';
import { getRouteDefinitionsFromHandler, hasAttachedRouteMetadata } from '@/routing/decorator/decorated-route';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';
import { createJiti } from 'jiti';
import * as fs from 'node:fs';
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

export async function loadRouteManifestModules(routeManifest: RouteManifest): Promise<RouteModule[]> {
  const manifestPath = resolveModulePath(routeManifest);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Route manifest does not exist: ${manifestPath}`);
  }

  const manifestExports = (await importRouteModule.import(manifestPath)) as Record<string, unknown>;
  const manifestRouteModules = extractRouteManifestModules(manifestExports, manifestPath);
  const manifestDirectory = path.dirname(manifestPath);

  return manifestRouteModules.map(routeModule => resolveModulePath(routeModule, manifestDirectory));
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

function extractRouteManifestModules(exports: Record<string, unknown>, manifestPath: string): RouteModule[] {
  const routeModules = exports.routeModules ?? exports.default;

  if (!isRouteModuleList(routeModules)) {
    throw new Error(`Route manifest must export a routeModules array: ${manifestPath}`);
  }

  return routeModules;
}

function isRouteModuleList(value: unknown): value is RouteModule[] {
  return Array.isArray(value) && value.every(routeModule => typeof routeModule === 'string');
}

function resolveModulePath(modulePath: string, baseDirectory: string = process.cwd()): string {
  return path.isAbsolute(modulePath) ? modulePath : path.resolve(baseDirectory, modulePath);
}
