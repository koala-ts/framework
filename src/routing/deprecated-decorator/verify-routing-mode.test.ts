import { describe, expect, test } from 'vitest';
import { exclusiveRoutingModeError, verifyRoutingMode } from '#koala/routing/deprecated-decorator/verify-routing-mode';

describe('verify routing mode', () => {
  test('it allows legacy routing mode', () => {
    expect(() =>
      verifyRoutingMode({
        controllers: [class LegacyController {}],
      }),
    ).not.toThrow();
  });

  test('it allows function first routing mode', () => {
    expect(() =>
      verifyRoutingMode({
        controllers: [],
        routes: [],
      }),
    ).not.toThrow();
  });

  test('it rejects mixing legacy and function first routing', () => {
    expect(() =>
      verifyRoutingMode({
        controllers: [class LegacyController {}],
        routes: [],
      }),
    ).toThrow(exclusiveRoutingModeError);
  });
});
