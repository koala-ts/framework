import { describe, expect, it, test } from 'vitest';
import {
  httpLifecycleFailure,
  httpLifecycleStartFailed,
  httpLifecycleStopFailed,
  httpLifecycleSuccess,
  isHttpLifecycleFailure,
  isHttpLifecycleSuccess,
} from '#contracts/http-bridge';

describe('HTTP bridge', () => {
  describe('HTTP lifecycle', () => {
    test('start failed factory', () => {
      const cause = new Error('unavailable');

      const actual = httpLifecycleStartFailed(cause);

      expect(actual).toEqual({
        code: 'START_FAILED',
        message: 'Failed to start HTTP server',
        cause,
      });
    });

    test('stop failed factory', () => {
      const cause = new Error('unavailable');

      const actual = httpLifecycleStopFailed(cause);

      expect(actual).toEqual({
        code: 'STOP_FAILED',
        message: 'Failed to stop HTTP server',
        cause,
      });
    });

    test('success result factory', () => {
      const value = { address: 'http://127.0.0.1:3000' };

      const actual = httpLifecycleSuccess(value);

      expect(actual).toEqual({ _tag: 'Success', value });
    });

    it('failed result factory', () => {
      const error = {
        code: 'START_FAILED',
        message: 'unavailable',
      } as const;

      const actual = httpLifecycleFailure(error);

      expect(actual).toEqual({ _tag: 'Failure', error });
    });

    test.each([
      [
        'success checker recognizes a successful lifecycle result as successful',
        () => httpLifecycleSuccess(undefined),
        true,
      ],
      [
        'success checker does not recognize a failed lifecycle result as successful',
        () =>
          httpLifecycleFailure({
            code: 'START_FAILED',
            message: 'unavailable',
          }),
        false,
      ],
    ])('%s', (_, createResult, expected) => {
      const result = createResult();

      const actual = isHttpLifecycleSuccess(result);

      expect(actual).toBe(expected);
    });

    test.each([
      [
        'failure checker does not recognize a successful lifecycle result as failed',
        () => httpLifecycleSuccess(undefined),
        false,
      ],
      [
        'failure checker recognizes a failed lifecycle result as failed',
        () =>
          httpLifecycleFailure({
            code: 'STOP_FAILED',
            message: 'unavailable',
          }),
        true,
      ],
    ])('%s', (_, createResult, expected) => {
      const result = createResult();

      const actual = isHttpLifecycleFailure(result);

      expect(actual).toBe(expected);
    });
  });
});
