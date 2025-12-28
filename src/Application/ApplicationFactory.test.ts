import { expect, test } from 'vitest';
import { create } from '@/Application/ApplicationFactory';
import { koalaDefaultConfig } from '@/Config';

test('create app with default config', () => {
  const app = create(koalaDefaultConfig);

  expect(app).toBeDefined();
});
