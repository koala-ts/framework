import type { RouteGroupDefinition } from '@/routing/group/route-group';
import { mergeRouteOptions } from '@/routing/registration/source/resolve-route-options';
import type { RouteDefinition } from '@/routing/route/route-definition.type';
import type { Request } from 'koa';
import type { RouteSource } from './route-source';

interface NormalizationContext<TRequest extends Request> {
  prefix: string;
  namePrefix: string;
  middleware: RouteDefinition<TRequest>['middleware'];
}

const defaultNormalizationContext = {
  prefix: '',
  namePrefix: '',
  middleware: [],
};

export function normalizeRouteSources<TRequest extends Request>(
  routeSources: RouteSource<TRequest>[],
  context: NormalizationContext<TRequest> = defaultNormalizationContext,
): RouteDefinition<TRequest>[] {
  const routes: RouteDefinition<TRequest>[] = [];

  for (const routeSource of routeSources) {
    if (isRouteGroupDefinition(routeSource)) {
      routes.push(...normalizeRouteGroup(routeSource, context));
      continue;
    }

    routes.push(normalizeRouteDefinition(routeSource, context));
  }

  return routes;
}

function normalizeRouteGroup<TRequest extends Request>(
  group: RouteGroupDefinition<TRequest>,
  parentContext: NormalizationContext<TRequest>,
): RouteDefinition<TRequest>[] {
  const context = createChildContext(group, parentContext);

  return normalizeRouteSources(applyRouteConfig(group.resolveRoutes(), group), context);
}

function createChildContext<TRequest extends Request>(
  group: RouteGroupDefinition<TRequest>,
  parentContext: NormalizationContext<TRequest>,
): NormalizationContext<TRequest> {
  return {
    prefix:
      group.options.prefix === undefined
        ? parentContext.prefix
        : joinRoutePath(parentContext.prefix, group.options.prefix),
    namePrefix: `${parentContext.namePrefix}${group.options.namePrefix ?? ''}`,
    middleware: [...parentContext.middleware, ...(group.options.middleware ?? [])],
  };
}

function normalizeRouteDefinition<TRequest extends Request>(
  route: RouteDefinition<TRequest>,
  context: NormalizationContext<TRequest>,
): RouteDefinition<TRequest> {
  return {
    ...route,
    path: joinRoutePath(context.prefix, route.path),
    name: route.name ? `${context.namePrefix}${route.name}` : undefined,
    middleware: [...context.middleware, ...route.middleware],
  };
}

function applyRouteConfig<TRequest extends Request>(
  routeSources: RouteSource<TRequest>[],
  group: RouteGroupDefinition<TRequest>,
): RouteSource<TRequest>[] {
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

function resolveRouteConfigOptions<TRequest extends Request>(
  route: RouteDefinition<TRequest>,
  routeConfig: NonNullable<RouteGroupDefinition<TRequest>['options']['routeConfig']>[string],
): Partial<Pick<RouteDefinition<TRequest>, 'parseBody' | 'bodyOptions'>> {
  return routeConfig.options ? mergeRouteOptions(route, routeConfig.options) : {};
}

function isRouteGroupDefinition<TRequest extends Request>(
  routeSource: RouteSource<TRequest>,
): routeSource is RouteGroupDefinition<TRequest> {
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
