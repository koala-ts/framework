import type { KoalaConfig } from '@/config/koala-config';
import type { HttpRequestBase } from '@/Http';

export const exclusiveRoutingModeError =
  'Koala routing mode is exclusive. Use either legacy controllers from @koala-ts/framework or routes from @koala-ts/framework/routing.';

export function verifyRoutingMode<TRequest extends HttpRequestBase>(config: KoalaConfig<TRequest>): void {
  const controllers = config.controllers ?? [];

  if (config.routes !== undefined && controllers.length > 0) {
    throw new Error(exclusiveRoutingModeError);
  }
}
