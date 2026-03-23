import { type HttpScope, Route } from '../../../src';

export const duplicateRouteB = Route({
  method: 'get',
  path: '/duplicate-route',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { duplicate: 'b' };
});
