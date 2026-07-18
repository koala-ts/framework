import type { HttpRequest, HttpRequestMessage } from '#http/foundation/http-request';
import type { HttpResponse } from '#http/foundation/http-response';

/**
 * Handles an HTTP request and returns a declarative HTTP response.
 */
export type Controller = (request: HttpRequest) => HttpResponse | Promise<HttpResponse>;

/** Information required to handle a request. */
export type RequestContext = Readonly<{
  /** Values captured from the matched route path. */
  params: HttpRequest['params'];
}>;

/**
 * The kernel input used to invoke a controller.
 *
 * It combines the raw HTTP message, route-matching context, and the
 * controller that receives the resulting {@link HttpRequest}.
 */
export type RawRequest = Readonly<{
  /** The raw HTTP message. */
  message: HttpRequestMessage;
  /** Framework information associated with the request. */
  context: RequestContext;
  /** The controller invoked with the prepared HTTP request. */
  controller: Controller;
}>;

type HandleRawRequest = (rawRequest: RawRequest) => Promise<HttpResponse>;

export const handleRawRequest: HandleRawRequest = async ({ controller, message, context }) =>
  controller({
    message,
    params: context.params,
  });
