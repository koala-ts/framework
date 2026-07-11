import type { RouteBodyOptions } from '#koala/routing/declaration/route-body-options.type';

export type RouteOptions = Partial<
  RouteBodyOptions & {
    parseBody?: boolean;
  }
>;
