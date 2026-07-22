/**
 * A declarative HTTP response header value.
 */
type HttpResponseHeaderValue = string | readonly string[];

/**
 * Declarative HTTP response headers.
 * Header names are normalized to lowercase by HTTP bridges.
 */
type HttpResponseHeaders = {
  /** A response header value indexed by its normalized lowercase name. */
  readonly [name: string]: HttpResponseHeaderValue;
};

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
  /** Response headers. */
  headers: HttpResponseHeaders;
  /** The response body. */
  body: Body;
}>;
