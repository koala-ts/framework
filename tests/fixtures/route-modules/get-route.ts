import { get, type HttpScope } from '../../../src';

export const getRoute = get('/get-sugar-route', (scope: HttpScope) => {
  scope.response.body = { ok: true, source: 'get-sugar' };
});
