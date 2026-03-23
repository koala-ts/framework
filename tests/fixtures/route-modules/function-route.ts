import { type HttpScope, Route } from '../../../src';

export const functionRoute = Route({
  method: 'get',
  path: '/decorator-function-route',
  options: { parseBody: false },
})((scope: HttpScope) => {
  scope.response.body = { ok: true, source: 'function' };
});
