import type { Controller, KoalaConfig, RoutingConfig } from '@/Config/types';
import { getRegisteredRouteDefinitions, getRouteDefinitionsFromHandler } from '@/routing/decorator/decorated-route';
import {
  assertValidDiscoveryConfig,
  selectDiscoverySource,
  type DiscoverySource,
} from '@/routing/discovery/discovery-config';
import { discoverRouteModules } from '@/routing/discovery/discover-route-modules';
import { loadRouteManifestModules, loadRouteModuleDefinitions } from '@/routing/discovery/load-route-modules';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';

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

async function resolveRoutesFromDiscoverySource(source: DiscoverySource): Promise<RouteMetadata[]> {
  switch (source.kind) {
    case 'route-modules':
      return await loadRouteModuleDefinitions(source.routeModules);
    case 'route-manifest':
      return await loadRouteModuleDefinitions(await loadRouteManifestModules(source.routeManifest));
    case 'routes-dir':
      return await loadRouteModuleDefinitions(discoverRouteModules(source.routesDir));
    case 'registered':
      return getRegisteredRouteDefinitions();
  }
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
