import type { Controller, KoalaConfig } from '@/Config/types';
import { getRegisteredRouteDefinitions, getRouteDefinitionsFromHandler } from '@/routing/decorator/decorated-route';
import { assertNoDuplicateRoutes } from '@/routing/discovery/assert-no-duplicate-routes';
import type { RouteMetadata } from '@/routing/decorator/route-metadata';

export function resolveConfiguredRoutes(config: KoalaConfig): RouteMetadata[] {
  const controllers = config.controllers ?? [];
  const routes = controllers.length > 0 ? resolveControllerDefinitions(controllers) : getRegisteredRouteDefinitions();

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
