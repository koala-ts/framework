import type { AppState, HttpScope } from '#koala/Http/index';
import type Koa from 'koa';

export type Application<StateT = AppState, ScopeT = HttpScope> = Koa<StateT, ScopeT> & {
  scope: HttpScope;
};
