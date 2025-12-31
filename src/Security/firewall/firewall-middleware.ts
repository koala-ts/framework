import { type HttpMiddleware, type HttpScope, type NextMiddleware } from '@/Http';
import { type Firewall, type SecurityConfig } from '@/Security/types';

export function firewall(config: SecurityConfig): HttpMiddleware {
  return async function firewallMiddleware(scope: HttpScope, next: NextMiddleware): Promise<void> {
    const firewall = config.firewalls.find(fw => {
      const regex = new RegExp(fw.pattern);
      return regex.test(scope.request.path);
    });

    if (undefined !== firewall) {
      await runFirewall(firewall, scope);
    }

    await next();
  };
}

async function runFirewall(firewall: Firewall, scope: HttpScope): Promise<void> {
  if (!firewall.security) return;
  if (undefined !== scope.user) return;

  const user = await firewall.provider?.(scope.request);

  if (undefined === user) scope.throw(401, 'Authentication required');

  scope.user = user;
}
