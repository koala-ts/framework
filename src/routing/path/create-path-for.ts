import { createPathCatalog } from '@/routing/route/source/create-path-catalog';
import { createPathTemplateResolver } from '@/routing/route/source/resolve-path-template';
import type { RouteSource } from '@/routing/route/source/route-source';

type PathParamValue = string | number | boolean;
type PathParams = Record<string, PathParamValue>;
type PathFor = (name: string, params?: PathParams) => string;

export function createPathFor(routeSources: RouteSource[]): PathFor {
  const resolvers = new Map<string, (params?: PathParams) => string>();

  for (const [name, pathTemplate] of createPathCatalog(routeSources)) {
    resolvers.set(name, createPathTemplateResolver(pathTemplate));
  }

  return (name: string, params?: PathParams) => {
    const resolvePath = resolvers.get(name);

    if (resolvePath === undefined) {
      throw new Error(`Unknown route name: ${name}.`);
    }

    return resolvePath(params);
  };
}
