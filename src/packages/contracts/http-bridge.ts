/**
 * A failure reported by an HTTP bridge lifecycle operation.
 */
export type HttpLifecycleError = Readonly<{
  readonly code: 'START_FAILED' | 'STOP_FAILED';
  readonly message: string;
  readonly cause?: unknown;
}>;

/** Creates an error for a failed HTTP server start. */
type HttpLifecycleStartFailureFactory = (cause?: unknown) => HttpLifecycleError;

export const httpLifecycleStartFailed: HttpLifecycleStartFailureFactory = cause => ({
  code: 'START_FAILED',
  message: 'Failed to start HTTP server',
  cause,
});

/** Creates an error for a failed HTTP server stop. */
type HttpLifecycleStopFailureFactory = (cause?: unknown) => HttpLifecycleError;

export const httpLifecycleStopFailed: HttpLifecycleStopFailureFactory = cause => ({
  code: 'STOP_FAILED',
  message: 'Failed to stop HTTP server',
  cause,
});

/**
 * A successful HTTP bridge lifecycle operation.
 */
type HttpLifecycleSuccess<Value> = Readonly<{
  readonly _tag: 'Success';
  readonly value: Value;
}>;

/**
 * A failed HTTP bridge lifecycle operation.
 */
type HttpLifecycleFailure = Readonly<{
  readonly _tag: 'Failure';
  readonly error: HttpLifecycleError;
}>;

/**
 * The outcome of an HTTP bridge lifecycle operation.
 */
export type HttpLifecycleResult<Value> = HttpLifecycleSuccess<Value> | HttpLifecycleFailure;

/** Creates a successful HTTP bridge lifecycle result. */
type HttpLifecycleSuccessFactory = <Value>(value: Value) => HttpLifecycleSuccess<Value>;

export const httpLifecycleSuccess: HttpLifecycleSuccessFactory = value => ({
  _tag: 'Success',
  value,
});

/** Creates a failed HTTP bridge lifecycle result. */
type HttpLifecycleFailureFactory = (error: HttpLifecycleError) => HttpLifecycleFailure;

export const httpLifecycleFailure: HttpLifecycleFailureFactory = error => ({
  _tag: 'Failure',
  error,
});

/** Determines whether an HTTP bridge lifecycle result is successful. */
type IsHttpLifecycleSuccess = <Value>(result: HttpLifecycleResult<Value>) => result is HttpLifecycleSuccess<Value>;

export const isHttpLifecycleSuccess: IsHttpLifecycleSuccess = result => result._tag === 'Success';

/** Determines whether an HTTP bridge lifecycle result is a failure. */
type IsHttpLifecycleFailure = <Value>(result: HttpLifecycleResult<Value>) => result is HttpLifecycleFailure;

export const isHttpLifecycleFailure: IsHttpLifecycleFailure = result => result._tag === 'Failure';

/**
 * Network binding configuration passed to an HTTP bridge.
 */
export type HttpListenOptions = Readonly<{
  readonly port: number;
  readonly host?: string;
}>;

/**
 * Runtime capability implemented by an HTTP server integration.
 */
export type HttpBridge = Readonly<{
  readonly start: (listen: HttpListenOptions) => Promise<HttpLifecycleResult<undefined>>;
  readonly stop: () => Promise<HttpLifecycleResult<undefined>>;
}>;
