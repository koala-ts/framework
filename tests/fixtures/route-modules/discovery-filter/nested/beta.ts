import { type HttpScope, Route } from '../../../../../src';

export const betaRoute = Route({
  method: 'get',
  path: '/beta',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { ok: true, source: 'beta' };
});
