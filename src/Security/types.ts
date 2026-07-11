import type { HttpRequest } from '#koala/Http/index';

export interface User {
  [key: string]: unknown;
  roles?: string[];
}

export type UserProvider = (request: HttpRequest) => Promise<User | undefined>;

export interface Firewall {
  pattern: string;
  security: boolean;
  provider?: UserProvider;
}

export interface SecurityConfig {
  firewalls: Firewall[];
}
