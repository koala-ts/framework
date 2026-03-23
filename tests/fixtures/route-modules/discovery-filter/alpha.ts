import { type HttpScope, Route } from '../../../../src';

export const alphaRoute = Route({
  method: 'get',
  path: '/alpha',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { ok: true, source: 'alpha' };
});
