import { type HttpScope, Route } from '../../../src';

export const duplicateRouteA = Route({
  method: 'get',
  path: '/duplicate-route',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { duplicate: 'a' };
});
