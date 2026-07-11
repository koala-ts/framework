// Application

export type { Application } from '#koala/application/application';
export { create } from '#koala/application/create-application';

import { getLegacyRoutes, registerLegacyRoutes } from '#koala/routing/deprecated-decorator/legacy-router';
import type { RouteMetadata as LegacyRouteMetadata } from '#koala/routing/deprecated-decorator/route-metadata';

export * from '#koala/config/config-loader';
export * from '#koala/config/default-config';
// Core modules
export type * from '#koala/config/koala-config';
export * from '#koala/Http/index';
export * from '#koala/Kernel/index';
export type { RouteOptions } from '#koala/routing/declaration/route-options.type';
export type { RouterMethod } from '#koala/routing/declaration/router-method.type';
// Routing
export * from '#koala/routing/deprecated-decorator/route';
export type { HttpMethod } from '#koala/routing/http-method.type';
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
export * from '#koala/Security/index';
// Serialization
export * from '#koala/serializer/index';
// Testing
export * from '#koala/Testing/index';
