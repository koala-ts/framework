/**
 * A declarative HTTP header value.
 */
export type HttpHeaderValue = string | readonly string[];

/**
 * Declarative HTTP response headers.
 * Header names are normalized to lowercase by HTTP bridges.
 */
export type HttpHeaders = Readonly<Record<string, HttpHeaderValue>>;

/**
 * A declarative HTTP response returned by a controller.
 *
 * @typeParam Body - The response body interpreted by the selected HTTP bridge.
 */
export type HttpResponse<Body = unknown> = Readonly<{
  /** The HTTP status code. */
  status: number;
  /** The optional HTTP reason phrase. */
  statusText?: string;
  /** Declarative response headers. */
  headers: HttpHeaders;
  /** The response body. */
  body: Body;
}>;
