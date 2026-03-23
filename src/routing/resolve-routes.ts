import * as fs from 'node:fs';
import * as path from 'node:path';
import { createJiti } from 'jiti';
import type { Controller, KoalaConfig, RouteManifest, RouteModule } from '@/Config';
import {
  getRegisteredRouteDefinitions,
  getRouteDefinitionsFromHandler,
  hasAttachedRouteMetadata,
} from '@/routing/decorator/decorated-route';
import type { RouteDefinition } from '@/routing/route-definition';

const supportedRouteModuleExtensions = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts']);
const importRouteModule = createJiti(import.meta.url, {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
  interopDefault: false,
  moduleCache: true,
});

export function resolveConfiguredRoutes(config: KoalaConfig): RouteDefinition[] {
  const routeModules = [...(config.routeModules ?? []), ...resolveConfiguredRouteModules(config)];
  const controllers = config.controllers ?? [];
  const routes = [...resolveRouteModuleDefinitions(routeModules), ...resolveControllerDefinitions(controllers)];

  if (hasExplicitRouteSources(config)) {
    return assertNoDuplicateRoutes(routes);
  }

  return assertNoDuplicateRoutes(getRegisteredRouteDefinitions());
}

function resolveConfiguredRouteModules(config: KoalaConfig): RouteModule[] {
  if (config.routeManifest !== undefined) {
    return resolveRouteManifest(config.routeManifest);
  }

  return discoverRouteModules(config.routesDir);
}

function resolveRouteModuleDefinitions(routeModules: RouteModule[]): RouteDefinition[] {
  const routes: RouteDefinition[] = [];

  for (const routeModule of routeModules) {
    const modulePath = resolveModulePath(routeModule);
    const exports = importRouteModule(modulePath) as Record<string, unknown>;

    routes.push(...extractRouteModuleDefinitions(exports, modulePath));
  }

  return routes;
}

function resolveRouteManifest(routeManifest: RouteManifest): RouteModule[] {
  const manifestPath = resolveModulePath(routeManifest);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Route manifest does not exist: ${manifestPath}`);
  }

  const manifestExports = importRouteModule(manifestPath) as Record<string, unknown>;
  const manifestRouteModules = extractRouteManifestModules(manifestExports, manifestPath);
  const manifestDirectory = path.dirname(manifestPath);

  return manifestRouteModules.map(routeModule => resolveModulePath(routeModule, manifestDirectory));
}

function resolveControllerDefinitions(controllers: Controller[]): RouteDefinition[] {
  const routes: RouteDefinition[] = [];

  for (const controller of controllers) {
    const prototype = controller.prototype as Record<string, unknown> | undefined;

    if (prototype === undefined) {
      continue;
    }

    for (const propertyName of Object.getOwnPropertyNames(prototype)) {
      if (propertyName === 'constructor') {
        continue;
      }

      routes.push(...getRouteDefinitionsFromHandler(prototype[propertyName], `${controller.name}.${propertyName}`));
    }
  }

  return routes;
}

function extractRouteModuleDefinitions(exports: Record<string, unknown>, source: string): RouteDefinition[] {
  const routes: RouteDefinition[] = [];

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

function discoverRouteModules(routesDir?: string): RouteModule[] {
  if (routesDir === undefined) {
    return [];
  }

  const rootDirectory = resolveModulePath(routesDir);

  if (!fs.existsSync(rootDirectory)) {
    throw new Error(`Routes directory does not exist: ${rootDirectory}`);
  }

  return readRouteModulePaths(rootDirectory).sort();
}

function readRouteModulePaths(currentDirectory: string): string[] {
  const routeModules: string[] = [];

  for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
    const absolutePath = path.join(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      routeModules.push(...readRouteModulePaths(absolutePath));
      continue;
    }

    if (isSupportedRouteModule(absolutePath)) {
      routeModules.push(absolutePath);
    }
  }

  return routeModules;
}

function isSupportedRouteModule(filePath: string): boolean {
  if (filePath.endsWith('.d.ts')) {
    return false;
  }

  if (filePath.includes('.test.') || filePath.includes('.spec.')) {
    return false;
  }

  return supportedRouteModuleExtensions.has(path.extname(filePath));
}

function hasExplicitRouteSources(config: KoalaConfig): boolean {
  return (
    (config.routeModules?.length ?? 0) > 0 ||
    config.routeManifest !== undefined ||
    config.routesDir !== undefined ||
    (config.controllers?.length ?? 0) > 0
  );
}

function resolveModulePath(modulePath: string, baseDirectory: string = process.cwd()): string {
  return path.isAbsolute(modulePath) ? modulePath : path.resolve(baseDirectory, modulePath);
}

function assertNoDuplicateRoutes(routes: RouteDefinition[]): RouteDefinition[] {
  const signatures = new Map<string, string | undefined>();

  for (const route of routes) {
    for (const method of route.methods) {
      const signature = `${method}:${route.path}`;

      if (signatures.has(signature)) {
        throw new Error(buildDuplicateRouteMessage(method, route.path, signatures.get(signature), route.source));
      }

      signatures.set(signature, route.source);
    }
  }

  return routes;
}

function buildDuplicateRouteMessage(
  method: string,
  pathName: string,
  existingSource?: string,
  duplicateSource?: string,
): string {
  const details = [existingSource, duplicateSource].filter(source => source !== undefined);

  if (details.length === 0) {
    return `Duplicate route detected for ${method.toUpperCase()} ${pathName}`;
  }

  return `Duplicate route detected for ${method.toUpperCase()} ${pathName}: ${details.join(' and ')}`;
}

function isRouteModuleList(value: unknown): value is RouteModule[] {
  return Array.isArray(value) && value.every(routeModule => typeof routeModule === 'string');
}
