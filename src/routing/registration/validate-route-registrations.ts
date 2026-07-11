import type { HttpRequestBase } from '#koala/Http/index';
import type { NormalizedRouteProps } from '#koala/routing/declaration/normalized-route-props.type';
import type { RouteRegistration } from '#koala/routing/registration/route-registration';

export function validateRouteRegistrations<TRequest extends HttpRequestBase>(
  routes: NormalizedRouteProps<TRequest>[],
  registrations: RouteRegistration<TRequest>[],
): void {
  validateUniqueRouteNames(routes);
  validateUniqueRouteSignatures(registrations);
}

function validateUniqueRouteSignatures<TRequest extends HttpRequestBase>(
  registrations: RouteRegistration<TRequest>[],
): void {
  const signatures = new Set<string>();

  for (const registration of registrations) {
    const signature = `${registration.method} ${registration.path}`;

    if (signatures.has(signature)) {
      throw new Error(`Duplicate route signature detected: ${registration.method.toUpperCase()} ${registration.path}.`);
    }

    signatures.add(signature);
  }
}

function validateUniqueRouteNames<TRequest extends HttpRequestBase>(routes: NormalizedRouteProps<TRequest>[]): void {
  const routeNames = new Set<string>();

  for (const route of routes) {
    if (route.name === undefined) {
      continue;
    }

    if (routeNames.has(route.name)) {
      throw new Error(`Duplicate route name detected: ${route.name}.`);
    }

    routeNames.add(route.name);
  }
}
