import type Koa from 'koa';
import type { AppState, HttpScope } from '@/Http';

export type Application<StateT = AppState, ScopeT = HttpScope> = Koa<StateT, ScopeT> & {
  scope: HttpScope;
};
