import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '#koala': path.resolve(__dirname, './src'),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'dist/**'],
    coverage: {
      exclude: ['**/dist/**', '**/playground/**', '**/tests/**', '**/types.*', '**/index.*'],
    },
  },
});
