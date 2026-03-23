import type { RouteMetadata } from '@/routing/decorator/route-metadata';

export function assertNoDuplicateRoutes(routes: RouteMetadata[]): void {
  const signatures = new Map<string, string | undefined>();

  for (const route of routes) {
    for (const method of route.methods) {
      const signature = `${method}:${route.path}`;

      if (signatures.has(signature)) {
        throw new Error(buildDuplicateRouteMessage(method, route.path, signatures.get(signature), route.source));
      }

      signatures.set(signature, route.source);
    }
  }
}

function buildDuplicateRouteMessage(
  method: string,
  pathName: string,
  existingSource?: string,
  duplicateSource?: string,
): string {
  const details = [existingSource, duplicateSource].filter(source => source !== undefined);

  if (details.length === 0) {
    return `Duplicate route detected for ${method.toUpperCase()} ${pathName}`;
  }

  return `Duplicate route detected for ${method.toUpperCase()} ${pathName}: ${details.join(' and ')}`;
}
