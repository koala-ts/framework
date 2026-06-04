// Application
export { create } from '@/application/create-application';
export type { Application } from '@/application/application';
import { getLegacyRoutes, registerLegacyRoutes } from '@/routing/deprecated-decorator/legacy-router';
import type { RouteMetadata as LegacyRouteMetadata } from '@/routing/deprecated-decorator/route-metadata';

// Core modules
export type * from '@/config/koala-config';
export * from '@/config/default-config';
export * from '@/config/config-loader';
export * from '@/Http';
export * from '@/Kernel';

// Routing
export * from '@/routing/deprecated-decorator/route';
export type { HttpMethod } from '@/routing/declaration/http-method.type';
export type { RouteOptions } from '@/routing/route/route-options.type';
export type { RouterMethod } from '@/routing/declaration/router-method.type';
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
