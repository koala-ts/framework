import { type HttpScope, Route } from '../../../../src';

export const discoveredFunctionRoute = Route({
  method: 'get',
  path: '/discovered-function-route',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { ok: true, source: 'routesDir' };
});
