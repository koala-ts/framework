import { normalizeRouteSources } from '@/routing/registration/source/normalize-route-sources';
import type { RouteSource } from '@/routing/registration/source/route-source';

export function createPathCatalog(routeSources: RouteSource[]): Map<string, string> {
  const catalog = new Map<string, string>();

  for (const route of normalizeRouteSources(routeSources)) {
    if (route.name === undefined) {
      continue;
    }

    if (catalog.has(route.name)) {
      throw new Error(`Duplicate route name detected: ${route.name}.`);
    }

    catalog.set(route.name, route.path);
  }

  return catalog;
}
