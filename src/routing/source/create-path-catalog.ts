import { normalizeRouteSources } from '@/routing/source/normalize-route-sources';
import type { RouteSource } from '@/routing/source/route-source';

export function createPathCatalog(routeSources: RouteSource[]): Map<string, string> {
  const catalog = new Map<string, string>();

  for (const route of normalizeRouteSources(routeSources)) {
    if (route.name === undefined) {
      continue;
    }

    catalog.set(route.name, route.path);
  }

  return catalog;
}
