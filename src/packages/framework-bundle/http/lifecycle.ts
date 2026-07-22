import {
  type HttpLifecycleResult,
  httpLifecycleSuccess,
  isHttpLifecycleFailure,
} from '@koala-ts/contracts/http-bridge';
import type { KoalaApp } from '#framework-bundle/koala';

/**
 * A running HTTP application and its cleanup capability.
 */
export type HttpServer = Readonly<{
  readonly app: KoalaApp;
}>;

/** Starts a Koala application through its bridge. */
export type Start = (app: KoalaApp) => Promise<HttpLifecycleResult<HttpServer>>;
export const start: Start = async app => {
  const result = await app.bridge.start(app.manifest.listen);

  return isHttpLifecycleFailure(result) ? result : httpLifecycleSuccess({ app });
};

/** Stops a running Koala application. */
export type Stop = (server: HttpServer) => Promise<HttpLifecycleResult<KoalaApp>>;
export const stop: Stop = async server => {
  const result = await server.app.bridge.stop();

  return isHttpLifecycleFailure(result) ? result : httpLifecycleSuccess(server.app);
};
