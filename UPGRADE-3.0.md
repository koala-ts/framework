# Upgrade from 2.x to 3.0

# Event

- Remove `eventBusMiddleware` and use `httpKernel` instead.

```diff
-- import { eventBusMiddleware } from '@koala-ts/framework/Event';
++ import { httpKernel } from '@koala-ts/framework/Http';
```
