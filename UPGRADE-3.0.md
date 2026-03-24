# Upgrade from 2.x to 3.0

## Routing

Legacy decorator routing from `@koala-ts/framework` is deprecated in 2.x and should be replaced with function-first routing from `@koala-ts/framework/routing`.

Deprecated legacy surface:

- `Route` from `@koala-ts/framework`
- `getRoutes` from `@koala-ts/framework`
- `registerRoutes` from `@koala-ts/framework`
- `KoalaConfig.controllers`

Recommended replacement:

- `Route` from `@koala-ts/framework/routing`
- `KoalaConfig.routes`

## Route Declaration

### Before

```ts
import { Route, type HttpScope } from '@koala-ts/framework';

class UsersController {
  @Route({ method: 'GET', path: '/users' })
  list(scope: HttpScope): void {
    scope.response.body = [];
  }
}
```

### After

```ts
import { Route } from '@koala-ts/framework/routing';
import type { HttpScope } from '@koala-ts/framework';

export const listUsers = Route({
  method: 'GET',
  path: '/users',
  handler: async (scope: HttpScope) => {
    scope.response.body = [];
  },
});
```

`Route` from `@koala-ts/framework/routing` accepts:

- `method`
- `path`
- `handler`
- optional `middleware`
- optional `options`

## Application Boot

### Before

```ts
import { create } from '@koala-ts/framework';

create({
  controllers: [UsersController],
});
```

### After

```ts
import { create } from '@koala-ts/framework';
import { Route } from '@koala-ts/framework/routing';
import type { HttpScope } from '@koala-ts/framework';

const listUsers = Route({
  method: 'GET',
  path: '/users',
  handler: async (scope: HttpScope) => {
    scope.response.body = [];
  },
});

create({
  routes: [listUsers],
});
```

## Test Agents

### Before

```ts
import { createTestAgent } from '@koala-ts/framework';

const agent = createTestAgent({
  controllers: [UsersController],
});
```

### After

```ts
import { createTestAgent, type HttpScope } from '@koala-ts/framework';
import { Route } from '@koala-ts/framework/routing';

const listUsers = Route({
  method: 'GET',
  path: '/users',
  handler: async (scope: HttpScope) => {
    scope.response.body = [];
  },
});

const agent = createTestAgent({
  routes: [listUsers],
});
```

## Routing Mode Rule

An application instance must use exactly one routing style:

- legacy routing with `controllers`
- function-first routing with `routes`

Mixing both in the same app or test agent is rejected.

Invalid configuration:

```ts
create({
  controllers: [UsersController],
  routes: [listUsers],
});
```

## Migration Notes

1. Move route declarations out of controller classes and into exported route values.
2. Import `Route` from `@koala-ts/framework/routing`.
3. Replace `controllers` usage with `routes`.
4. Update test agents to use the same `routes` configuration.
5. Do not mix `controllers` and `routes` in the same application instance.
