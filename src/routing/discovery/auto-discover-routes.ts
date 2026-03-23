import type { Application } from '@/application/application';
import type { RoutingConfig } from '@/Config';
import { registerRouteMetadata } from '@/routing/decorator/router';
import { assertNoDuplicateRoutes } from '@/routing/discovery/assert-no-duplicate-routes';
import { assertValidDiscoveryConfig, selectDiscoverySource } from '@/routing/discovery/discovery-config';
import { discoverRouteModules } from '@/routing/discovery/discover-route-modules';
import { loadRouteManifestModules, loadRouteModuleDefinitions } from '@/routing/discovery/load-route-modules';
import { getRegisteredRouteDefinitions } from '@/routing/decorator/decorated-route';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';

export async function autoDiscoverRoutes(app: Application, routingConfig: RoutingConfig): Promise<Application> {
  assertValidDiscoveryConfig(routingConfig);

  const source = selectDiscoverySource(routingConfig);
  const routes = await resolveRoutesFromDiscoverySource(source);

  assertNoDuplicateRoutes(routes);

  return registerRouteMetadata(app, routes);
}

async function resolveRoutesFromDiscoverySource(
  source: ReturnType<typeof selectDiscoverySource>,
): Promise<RouteMetadata[]> {
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
