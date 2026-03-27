import type { KoalaConfig } from '@/config/koala-config';

export const exclusiveRoutingModeError =
  'Koala routing mode is exclusive. Use either legacy controllers from @koala-ts/framework or routes from @koala-ts/framework/routing.';

export function verifyRoutingMode(config: KoalaConfig): void {
  const controllers = config.controllers ?? [];

  if (config.routes !== undefined && controllers.length > 0) {
    throw new Error(exclusiveRoutingModeError);
  }
}
