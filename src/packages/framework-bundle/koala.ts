import type { HttpBridge, HttpListenOptions } from '@koala-ts/contracts/http-bridge';

/**
 * Immutable configuration for an HTTP application.
 */
export type HttpManifest = Readonly<{
  readonly type: 'http';
  readonly listen: HttpListenOptions;
}>;

/**
 * The Koala application type.
 */
export type KoalaApp = Readonly<{
  readonly manifest: HttpManifest;
  readonly bridge: HttpBridge;
}>;

/**
 * Creates a Koala application.
 *
 * @example
 * ```ts
 * const app = koala(
 *   { type: 'http', listen: { port: 3000 } },
 *   fastify(),
 * );
 * ```
 */
type Koala = (manifest: HttpManifest, bridge: HttpBridge) => KoalaApp;
export const koala: Koala = (manifest, bridge) => ({ manifest, bridge });
