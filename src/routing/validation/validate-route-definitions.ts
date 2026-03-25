import type { RouteDefinition } from '@/routing/definition/route-definition';
import type { RouteRegistration } from '@/routing/registration/route-registration';

export function validateRouteDefinitions(routes: RouteDefinition[], registrations: RouteRegistration[]): void {
  validateUniqueRouteNames(routes);
  validateUniqueRouteSignatures(registrations);
}

function validateUniqueRouteSignatures(registrations: RouteRegistration[]): void {
  const signatures = new Set<string>();

  for (const registration of registrations) {
    const signature = `${registration.method} ${registration.path}`;

    if (signatures.has(signature)) {
      throw new Error(`Duplicate route signature detected: ${registration.method.toUpperCase()} ${registration.path}.`);
    }

    signatures.add(signature);
  }
}

function validateUniqueRouteNames(routes: RouteDefinition[]): void {
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
