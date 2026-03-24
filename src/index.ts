// Application
export { create } from '@/application/create-application';
export type { Application } from '@/application/application';

// Core modules
export * from '@/Config';
export * from '@/Http';
export * from '@/Kernel';

// Routing
export * from '@/routing/decorator/route';
export {
  getLegacyRoutes as getRoutes,
  registerLegacyRoutes as registerRoutes,
} from '@/routing/decorator/legacy-router';
export type { HttpMethod } from '@/routing/http-method';
export type { RouteMetadata } from '@/routing/decorator/route-metadata';
export type { RouteOptions } from '@/routing/route-options';
export type { RouterMethod } from '@/routing/router-method';

// Security
export * from '@/Security';

// Testing
export * from '@/Testing';

// Serialization
export * from '@/serializer';
