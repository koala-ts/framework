import { create } from '@/application/create-application';
import { koalaDefaultConfig } from '@/Config';
import { expect, test } from 'vitest';

test('create app with default config', () => {
  const app = create(koalaDefaultConfig);

  expect(app).toBeDefined();
});
