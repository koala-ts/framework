import type { HttpRequestBase } from '@/Http';
import type { NormalizedRouteProps } from '@/routing/declaration/normalized-route-props.type';
import type { RouteGroupDefinition } from '@/routing/declaration/route-group';
import type { RouteSource } from '@/routing/declaration/route-source.type';
import { mergeRouteOptions } from '@/routing/normalization/resolve-route-options';

interface NormalizationContext<TRequest extends HttpRequestBase> {
  prefix: string;
  namePrefix: string;
  middleware: NormalizedRouteProps<TRequest>['middleware'];
}

const defaultNormalizationContext = {
  prefix: '',
  namePrefix: '',
  middleware: [],
};

export function normalizeRouteSources<TRequest extends HttpRequestBase>(
  routeSources: RouteSource<TRequest>[],
  context: NormalizationContext<TRequest> = defaultNormalizationContext,
): NormalizedRouteProps<TRequest>[] {
  const routes: NormalizedRouteProps<TRequest>[] = [];

  for (const routeSource of routeSources) {
    if (isRouteGroupDefinition(routeSource)) {
      routes.push(...normalizeRouteGroup(routeSource, context));
      continue;
    }

    routes.push(normalizeRouteDefinition(routeSource, context));
  }

  return routes;
}

function normalizeRouteGroup<TRequest extends HttpRequestBase>(
  group: RouteGroupDefinition<TRequest>,
  parentContext: NormalizationContext<TRequest>,
): NormalizedRouteProps<TRequest>[] {
  const context = createChildContext(group, parentContext);

  return normalizeRouteSources(applyRouteConfig(group.resolveRoutes(), group), context);
}

function createChildContext<TRequest extends HttpRequestBase>(
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

function normalizeRouteDefinition<TRequest extends HttpRequestBase>(
  route: NormalizedRouteProps<TRequest>,
  context: NormalizationContext<TRequest>,
): NormalizedRouteProps<TRequest> {
  return {
    ...route,
    path: joinRoutePath(context.prefix, route.path),
    name: route.name ? `${context.namePrefix}${route.name}` : undefined,
    middleware: [...context.middleware, ...route.middleware],
  };
}

function applyRouteConfig<TRequest extends HttpRequestBase>(
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

function resolveRouteConfigOptions<TRequest extends HttpRequestBase>(
  route: NormalizedRouteProps<TRequest>,
  routeConfig: NonNullable<RouteGroupDefinition<TRequest>['options']['routeConfig']>[string],
): Partial<Pick<NormalizedRouteProps<TRequest>, 'parseBody' | 'bodyOptions'>> {
  return routeConfig.options ? mergeRouteOptions(route, routeConfig.options) : {};
}

function isRouteGroupDefinition<TRequest extends HttpRequestBase>(
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
