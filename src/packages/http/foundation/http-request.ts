/** Values captured from a matched HTTP route path. */
export type HttpRouteParams = Readonly<Record<string, string>>;

/**
 * An HTTP request supplied to a controller.
 */
export type HttpRequest = Readonly<{
  /** The complete standard Web request. */
  message: Request;
  /** Values captured from the route path. */
  params: HttpRouteParams;
}>;
