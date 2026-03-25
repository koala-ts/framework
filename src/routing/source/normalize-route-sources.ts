import type { RouteDefinition } from '@/routing/definition/route-definition';
import { mergeRouteOptions } from '@/routing/definition/resolve-route-options';
import type { RouteGroupDefinition } from '@/routing/helpers/route-group';
import type { RouteSource } from './route-source';

interface NormalizationContext {
  prefix: string;
  namePrefix: string;
  middleware: RouteDefinition['middleware'];
}

const defaultNormalizationContext: NormalizationContext = {
  prefix: '',
  namePrefix: '',
  middleware: [],
};

export function normalizeRouteSources(
  routeSources: RouteSource[],
  context: NormalizationContext = defaultNormalizationContext,
): RouteDefinition[] {
  const routes: RouteDefinition[] = [];

  for (const routeSource of routeSources) {
    if (isRouteGroupDefinition(routeSource)) {
      routes.push(...normalizeRouteGroup(routeSource, context));
      continue;
    }

    routes.push(normalizeRouteDefinition(routeSource, context));
  }

  return routes;
}

function normalizeRouteGroup(group: RouteGroupDefinition, parentContext: NormalizationContext): RouteDefinition[] {
  const context = createChildContext(group, parentContext);

  return normalizeRouteSources(applyRouteConfig(group.resolveRoutes(), group), context);
}

function createChildContext(group: RouteGroupDefinition, parentContext: NormalizationContext): NormalizationContext {
  return {
    prefix:
      group.options.prefix === undefined
        ? parentContext.prefix
        : joinRoutePath(parentContext.prefix, group.options.prefix),
    namePrefix: `${parentContext.namePrefix}${group.options.namePrefix ?? ''}`,
    middleware: [...parentContext.middleware, ...(group.options.middleware ?? [])],
  };
}

function normalizeRouteDefinition(route: RouteDefinition, context: NormalizationContext): RouteDefinition {
  return {
    ...route,
    path: joinRoutePath(context.prefix, route.path),
    name: route.name ? `${context.namePrefix}${route.name}` : undefined,
    middleware: [...context.middleware, ...route.middleware],
  };
}

function applyRouteConfig(routeSources: RouteSource[], group: RouteGroupDefinition): RouteSource[] {
  return routeSources.map(routeSource => {
    if (isRouteGroupDefinition(routeSource)) {
      return routeSource;
    }

    const routeConfig = routeSource.name ? group.options.routeConfig?.[routeSource.name] : undefined;

    if (!routeConfig) {
      return routeSource;
    }

    return {
      ...routeSource,
      middleware: [...(routeConfig.middleware ?? []), ...routeSource.middleware],
      ...resolveRouteConfigOptions(routeSource, routeConfig),
    };
  });
}

function resolveRouteConfigOptions(
  route: RouteDefinition,
  routeConfig: NonNullable<RouteGroupDefinition['options']['routeConfig']>[string],
): Partial<Pick<RouteDefinition, 'parseBody' | 'bodyOptions'>> {
  return routeConfig.options ? mergeRouteOptions(route, routeConfig.options) : {};
}

function isRouteGroupDefinition(routeSource: RouteSource): routeSource is RouteGroupDefinition {
  return 'kind' in routeSource && routeSource.kind === 'route-group';
}

function joinRoutePath(prefix: string, path: string): string {
  const normalizedPrefix = trimTrailingSlash(prefix);
  const normalizedPath = trimLeadingSlash(path);

  if (normalizedPrefix === '') {
    return normalizedPath === '' ? '/' : `/${normalizedPath}`;
  }

  if (normalizedPath === '') {
    return normalizedPrefix;
  }

  return `${normalizedPrefix}/${normalizedPath}`;
}

function trimLeadingSlash(value: string): string {
  return value.replace(/^\/+/, '');
}

function trimTrailingSlash(value: string): string {
  if (value === '') {
    return value;
  }

  const normalized = value.replace(/\/+$/, '');

  return normalized === '' ? '' : normalized;
}
