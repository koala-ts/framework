// Application

export type { Application } from '@/application/application';
export { create } from '@/application/create-application';

import { getLegacyRoutes, registerLegacyRoutes } from '@/routing/deprecated-decorator/legacy-router';
import type { RouteMetadata as LegacyRouteMetadata } from '@/routing/deprecated-decorator/route-metadata';

export * from '@/config/config-loader';
export * from '@/config/default-config';
// Core modules
export type * from '@/config/koala-config';
export * from '@/Http';
export * from '@/Kernel';
export type { RouteOptions } from '@/routing/declaration/route-options.type';
export type { RouterMethod } from '@/routing/declaration/router-method.type';
// Routing
export * from '@/routing/deprecated-decorator/route';
export type { HttpMethod } from '@/routing/http-method.type';
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
// Serialization
export * from '@/serializer';
// Testing
export * from '@/Testing';
