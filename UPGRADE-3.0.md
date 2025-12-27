# Upgrade from 2.x to 3.0

# Event

- Remove `eventBusMiddleware` and use `httpKernel` instead.
- Replace all the types from `@koala-ts/framework/Event` with types from `@koala-ts/framework/Kernel`.

```diff
-- import { eventBusMiddleware } from '@koala-ts/framework/Event';
++ import { httpKernel } from '@koala-ts/framework/Kernel';
```
