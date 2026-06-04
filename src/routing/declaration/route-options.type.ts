import type { RouteBodyOptions } from '@/routing/declaration/route-body-options.type';

export type RouteOptions = Partial<
  RouteBodyOptions & {
    parseBody?: boolean;
  }
>;
