import type { RouteSource } from '@/routing/declaration/route-source.type';
import { normalizeRouteSources } from '@/routing/normalization/normalize-route-sources';

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
