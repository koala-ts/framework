import { type HttpScope, Route } from '../../../src';

export const answer = 42;

export const mixedRoute = Route({
  method: 'get',
  path: '/mixed-route',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { ok: true, source: 'mixed' };
});
