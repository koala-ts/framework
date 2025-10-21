import type { Test } from 'supertest';

export interface TestAgent<Req extends Test = Test> {
  host(host: string): this;

  'm-search'(url: string): Req;

  acl(url: string): Req;

  bind(url: string): Req;

  checkout(url: string): Req;

  connect(url: string): Req;

  copy(url: string): Req;

  del(url: string): Req;

  delete(url: string): Req;

  get(url: string): Req;

  head(url: string): Req;

  link(url: string): Req;

  lock(url: string): Req;

  merge(url: string): Req;

  mkactivity(url: string): Req;

  mkcalendar(url: string): Req;

  mkcol(url: string): Req;

  move(url: string): Req;

  notify(url: string): Req;

  options(url: string): Req;

  patch(url: string): Req;

  post(url: string): Req;

  propfind(url: string): Req;

  proppatch(url: string): Req;

  purge(url: string): Req;

  put(url: string): Req;

  rebind(url: string): Req;

  report(url: string): Req;

  search(url: string): Req;

  source(url: string): Req;

  subscribe(url: string): Req;

  trace(url: string): Req;

  unbind(url: string): Req;

  unlink(url: string): Req;

  unlock(url: string): Req;

  unsubscribe(url: string): Req;
}
