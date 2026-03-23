import type { RouteManifest, RouteModule, RoutingConfig } from '@/Config';

export type DiscoverySource =
  | { kind: 'route-modules'; routeModules: RouteModule[] }
  | { kind: 'route-manifest'; routeManifest: RouteManifest }
  | { kind: 'routes-dir'; routesDir: string }
  | { kind: 'registered' };

export function assertValidDiscoveryConfig(config: RoutingConfig): void {
  const configuredSources = [
    config.routeModules !== undefined ? 'routeModules' : undefined,
    config.routesDir !== undefined ? 'routesDir' : undefined,
    config.routeManifest !== undefined ? 'routeManifest' : undefined,
  ].filter((source): source is string => source !== undefined);

  if (configuredSources.length > 1) {
    throw new Error('Invalid routing configuration: choose only one of routeModules, routesDir, or routeManifest.');
  }
}

export function selectDiscoverySource(config: RoutingConfig): DiscoverySource {
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
