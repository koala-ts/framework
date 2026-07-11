import type Koa from 'koa';
import type { AppState, HttpScope } from '#koala/Http/index';

export type Application<StateT = AppState, ScopeT = HttpScope> = Koa<StateT, ScopeT> & {
  scope: HttpScope;
};
