import { type HttpRequest } from '@/Http';

export interface User {
  identifier: string;
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
