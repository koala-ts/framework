/** Values captured from a matched HTTP route path. */
type HttpRouteParams = Readonly<Record<string, string>>;

/** A received HTTP request header value. */
type HttpRequestHeaderValue = string | readonly string[];

/** HTTP request headers supplied by a bridge. */
type HttpRequestHeaders = {
  /** A received header value indexed by its normalized lowercase name. */
  readonly [name: string]: HttpRequestHeaderValue;
};

/**
 * A raw HTTP message received by Koala.
 *
 * It contains no eagerly parsed query, cookies, or body.
 */
export type HttpRequestMessage = Readonly<{
  /** The HTTP method as received. */
  method: string;
  /** The raw HTTP request target as a URI reference, usually `/path?query`. */
  url: string;
  /** The HTTP headers supplied by the bridge. */
  headers: HttpRequestHeaders;
  /** A single-consumption source of raw body bytes. */
  body: AsyncIterable<Uint8Array>;
}>;

/**
 * An HTTP request supplied to a controller.
 */
export type HttpRequest = Readonly<{
  /** The raw HTTP message. */
  message: HttpRequestMessage;
  /** Values captured from the route path. */
  params: HttpRouteParams;
}>;
