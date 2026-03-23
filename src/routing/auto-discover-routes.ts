import type { Application } from '@/application/application';
import type { RoutingConfig } from '@/Config';
import { registerRouteMetadata } from '@/routing/decorator/router';
import { resolveDiscoveredRoutes } from '@/routing/resolve-routes';

export async function autoDiscoverRoutes(app: Application, routingConfig: RoutingConfig): Promise<Application> {
  const routes = await resolveDiscoveredRoutes(routingConfig);

  return registerRouteMetadata(app, routes);
}
