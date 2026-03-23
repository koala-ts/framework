import type { Application } from '@/application/application';
import type { Controller, KoalaConfig, RouteManifest, RouteModule, RoutingConfig } from '@/Config/types';
import {
  getRegisteredRouteDefinitions,
  getRouteDefinitionsFromHandler,
  hasAttachedRouteMetadata,
} from '@/routing/decorator/decorated-route';
import { registerRouteMetadata } from '@/routing/decorator/router';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';
import { createJiti } from 'jiti';
import * as fs from 'node:fs';
import * as path from 'node:path';

const supportedRouteModuleExtensions = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts']);
const importRouteModule = createJiti(import.meta.url, {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
  interopDefault: false,
  moduleCache: true,
});

type DiscoverySource =
  | { kind: 'route-modules'; routeModules: RouteModule[] }
  | { kind: 'route-manifest'; routeManifest: RouteManifest }
  | { kind: 'routes-dir'; routesDir: string }
  | { kind: 'registered' };

export function resolveConfiguredRoutes(config: KoalaConfig): RouteMetadata[] {
  const controllers = config.controllers ?? [];
  const routes = controllers.length > 0 ? resolveControllerDefinitions(controllers) : getRegisteredRouteDefinitions();

  assertNoDuplicateRoutes(routes);

  return routes;
}

export async function resolveDiscoveredRoutes(config: RoutingConfig): Promise<RouteMetadata[]> {
  assertValidDiscoveryConfig(config);

  const source = selectDiscoverySource(config);
  const routes = await resolveRoutesFromDiscoverySource(source);

  assertNoDuplicateRoutes(routes);

  return routes;
}

export async function autoDiscoverRoutes(app: Application, routingConfig: RoutingConfig): Promise<Application> {
  const routes = await resolveDiscoveredRoutes(routingConfig);

  return registerRouteMetadata(app, routes);
}

function resolveControllerDefinitions(controllers: Controller[]): RouteMetadata[] {
  const routes: RouteMetadata[] = [];

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

function extractRouteModuleDefinitions(exports: Record<string, unknown>, source: string): RouteMetadata[] {
  const routes: RouteMetadata[] = [];
  const exportedValues = Object.values(exports);

  for (const exportedValue of exportedValues) {
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
  const entries = fs.readdirSync(currentDirectory, { withFileTypes: true });

  for (const entry of entries) {
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

  if (hasIgnoredTestSuffix(filePath)) {
    return false;
  }

  return supportedRouteModuleExtensions.has(path.extname(filePath));
}

function assertValidDiscoveryConfig(config: RoutingConfig): void {
  const configuredSources = [
    config.routeModules !== undefined ? 'routeModules' : undefined,
    config.routesDir !== undefined ? 'routesDir' : undefined,
    config.routeManifest !== undefined ? 'routeManifest' : undefined,
  ].filter((source): source is string => source !== undefined);

  if (configuredSources.length > 1) {
    throw new Error('Invalid routing configuration: choose only one of routeModules, routesDir, or routeManifest.');
  }
}

function selectDiscoverySource(config: RoutingConfig): DiscoverySource {
  if (config.routeModules !== undefined) {
    return { kind: 'route-modules', routeModules: config.routeModules };
  }

  if (config.routeManifest !== undefined) {
    return { kind: 'route-manifest', routeManifest: config.routeManifest };
  }

  if (config.routesDir !== undefined) {
    return { kind: 'routes-dir', routesDir: config.routesDir };
  }

  return { kind: 'registered' };
}

async function resolveRoutesFromDiscoverySource(source: DiscoverySource): Promise<RouteMetadata[]> {
  switch (source.kind) {
    case 'route-modules':
      return await resolveAsyncRouteModuleDefinitions(source.routeModules);
    case 'route-manifest':
      return await resolveAsyncRouteModuleDefinitions(await resolveAsyncRouteManifest(source.routeManifest));
    case 'routes-dir':
      return await resolveAsyncRouteModuleDefinitions(discoverRouteModules(source.routesDir));
    case 'registered':
      return getRegisteredRouteDefinitions();
  }
}

function resolveModulePath(modulePath: string, baseDirectory: string = process.cwd()): string {
  return path.isAbsolute(modulePath) ? modulePath : path.resolve(baseDirectory, modulePath);
}

async function resolveAsyncRouteModuleDefinitions(routeModules: RouteModule[]): Promise<RouteMetadata[]> {
  const routes: RouteMetadata[] = [];

  for (const routeModule of routeModules) {
    const modulePath = resolveModulePath(routeModule);
    const exports = (await importRouteModule.import(modulePath)) as Record<string, unknown>;

    routes.push(...extractRouteModuleDefinitions(exports, modulePath));
  }

  return routes;
}

async function resolveAsyncRouteManifest(routeManifest: RouteManifest): Promise<RouteModule[]> {
  const manifestPath = resolveModulePath(routeManifest);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Route manifest does not exist: ${manifestPath}`);
  }

  const manifestExports = (await importRouteModule.import(manifestPath)) as Record<string, unknown>;
  const manifestRouteModules = extractRouteManifestModules(manifestExports, manifestPath);
  const manifestDirectory = path.dirname(manifestPath);

  return manifestRouteModules.map(routeModule => resolveModulePath(routeModule, manifestDirectory));
}

function assertNoDuplicateRoutes(routes: RouteMetadata[]): void {
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

function hasIgnoredTestSuffix(filePath: string): boolean {
  return filePath.includes('.test.') || filePath.includes('.spec.');
}
