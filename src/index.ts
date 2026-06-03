// Application
export { create } from '@/application/create-application';
export type { Application } from '@/application/application';
import { getLegacyRoutes, registerLegacyRoutes } from '@/routing/legacy-decorator/legacy-router';
import type { RouteMetadata as LegacyRouteMetadata } from '@/routing/legacy-decorator/route-metadata';

// Core modules
export type * from '@/config/koala-config';
export * from '@/config/default-config';
export * from '@/config/config-loader';
export * from '@/Http';
export * from '@/Kernel';

// Routing
export * from '@/routing/legacy-decorator/route';
export type { HttpMethod } from '@/routing/http-method';
export type { RouteOptions } from '@/routing/route-options';
export type { RouterMethod } from '@/routing/router-method';
/**
 * @deprecated Use `Route` from `@koala-ts/framework/routing` instead.
 */
export const getRoutes = getLegacyRoutes;
/**
 * @deprecated Use `Route` and `create({ routes })` from `@koala-ts/framework/routing` instead.
 */
export const registerRoutes = registerLegacyRoutes;
/**
 * @deprecated Legacy decorator routing metadata. Use `@koala-ts/framework/routing` instead.
 */
export type RouteMetadata = LegacyRouteMetadata;

// Security
export * from '@/Security';

// Testing
export * from '@/Testing';

// Serialization
export * from '@/serializer';
