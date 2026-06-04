import type { RouteSource } from '@/routing/declaration/route-source.type';
import { createPathCatalog } from '@/routing/registration/source/create-path-catalog';
import { createPathTemplateResolver } from '@/routing/registration/source/resolve-path-template';

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
